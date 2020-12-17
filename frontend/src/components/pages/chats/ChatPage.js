import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import moment from "moment";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";

import { baseUrl } from "../../../constants";
import { getTokenFromLocalStorage } from "../../../api/services/servicesApi";

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    paddingTop: 10,
    fontSize: 18,
  },

  textarea: {
    minWidth: "340px",
    width: "40vw",
    backgroundColor: "#fffde7",
    border: "1px solid #ffefa2",
    overflow: "hidden",
    height: "276px",
    margin: "auto",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column-reverse",
  },

  messageList: {
    textAlign: "left",
    margin: "30px 40px",
    listStyleType: "none",
  },

  separateMessageSent: {
    backgroundColor: "#0784ef61",
    borderRadius: "10px",
    display: "inline-block",
    width: "100%",
    "&:not(:first-child)": { marginTop: "25px" },
  },
  separateMessageReply: {
    display: "inline-block",
    width: "100%",
    "&:not(:first-child)": { marginTop: "25px" },
  },

  sender: {
    fontSize: "14px",
    color: "#848484",
    wordBreak: "break-all",
  },
  messageText: {
    float: "left",
    color: "#a20202",
    wordBreak: "break-all",
  },

  datetime: {
    fontSize: "14px",
    float: "right",
    color: "#100da5",
  },

  messageInput: {
    display: "block",
    width: "100%",
    maxWidth: "380px",
    margin: "15px auto 5px",
  },
  sendMessageButton: {
    // [theme.breakpoints.down("sm")]: {},
    [theme.breakpoints.up("sm")]: {
      marginRight: "18.5vw",
    },
    display: "block",
    float: "right",
  },
}));

function ChatPage(props) {
  const classes = useStyles();
  const urlParams = useParams();

  const { isAuthed, userData } = props;

  const [socket, setSocket] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  function onChangeMessage(e) {
    setMessage(e.target.value);
  }

  function handleSendMessage(e) {
    e.preventDefault();
    if (message.trim()) {
      const sendingObj = JSON.stringify({
        command: "new_message",
        message: message,
      });
      socket.send(sendingObj);
      setMessage("");
    }
  }

  useEffect(() => {
    function connect() {
      const loc = window.location;
      let wsStart = "ws://";
      if (loc.protocol === "https:") {
        wsStart = "wss://";
      }

      // const baseUrl = "127.0.0.1:8000";
      const baseUrl = "34.105.189.224";
      // const baseUrl = "34.105.244.19";

      let wsPath = wsStart + baseUrl + "/ws" + loc.pathname;
      if (!wsPath.endsWith("/")) wsPath += "/";
      const socket_ = new WebSocket(
        wsPath + "?token=" + getTokenFromLocalStorage()
      );

      socket_.onopen = () => {
        socket_.send(
          JSON.stringify({
            command: "fetch_messages",
            chat_id: urlParams.chatId,
          })
        );
      };
      socket_.onmessage = (event) => {
        const receivedObj = JSON.parse(event.data);
        const command = receivedObj.command;

        if (command === "fetch_messages") {
          const messagesObj = receivedObj.messages;
          const obtainedMessageNum = 20; // message number obtained from server
          setMessages((messages) => {
            messages.splice(
              messages.length - obtainedMessageNum,
              obtainedMessageNum
            );
            return [...messages, ...messagesObj];
          });
        } else if (command === "new_message") {
          const message = receivedObj.message;
          setMessages((messages) => [...messages, message]);
        }
      };
      socket_.onerror = (error) => {
        console.log(`[error] ${error.message}`);
      };
      socket_.onclose = (event) => {
        if (!event.wasClean) {
          setTimeout(() => {
            if (!(socket_.readyState === 1)) {
              console.log("Waiting for connection...");
              connect();
            }
          }, 3000);
        }
      };
      setSocket(socket_);
      return socket_;
    }
    const socketConnection = connect();
    // socket_.on("get_users", (users) => {
    //   setUsers(users);
    // });
    // socket_.emit("get_users");

    // socket_.on("user_connected", ({ users, newUser }) => {
    //   socket_.emit("get_users");
    //   setUsers(users);

    //   console.log(newUser);
    // });
    return () => {
      socketConnection.close();
    };
  }, []);

  const renderMessages = (messages) => (
    <ul className={classes.messageList}>
      {messages.map((msg, index) => (
        <li
          className={
            msg.sender_id === userData.id
              ? classes.separateMessageSent
              : classes.separateMessageReply
          }
          key={index}
        >
          <div className={classes.sender}>{msg.sender_name}</div>
          <div className={classes.messageText}>{msg.message}</div>
          <div className={classes.datetime}>
            {`${new Date(msg.created_at)}`}
          </div>
          {/* {msg.updated_at} */}
        </li>
      ))}
      <div ref={messagesEndRef} />
    </ul>
  );

  // scroll to the bottom
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  // useEffect(scrollToBottom, [messages]);

  return (
    <Container className={classes.container} maxWidth="md">
      <div className={classes}>
        {/* <!-- Left Column--> */}
        <div className={classes}>
          {/* <!--Online users goes here--> */}
          <ul>
            {users.map((user, index) => (
              <li key={index} style={{ color: user.color }}>
                {user.username}
              </li>
            ))}
          </ul>
        </div>
        {/* <!--Chat Wrapper --> */}
        <div className={classes}>
          <div className={classes}>
            <header>
              <h1>Chat</h1>
            </header>
          </div>

          {/* <!--Messages container--> */}
          <div id="chatroom">
            {/* <!--x is typing goes here--> */}
            <div id="feedback"></div>
          </div>
          <form onSubmit={handleSendMessage} className={classes}>
            {/* Messages List */}
            <div className={classes.textarea}>{renderMessages(messages)}</div>
            <input
              className={classes}
              type="text"
              value={message}
              onChange={onChangeMessage}
            />
            <button className={classes} type="submit">
              Send message
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    isAuthed: state.isAuthedReducer.isAuthed,
    userData: {
      id: state.userDataReducer.id,
      displayName: state.userDataReducer.displayName,
    },
  };
}

export default connect(mapStateToProps)(ChatPage);
