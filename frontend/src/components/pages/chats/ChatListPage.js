import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import ChatComponent from "./ChatComponent";

const useStyles = makeStyles({
  container: {
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    paddingTop: 10,
    fontSize: 18,
  },

  contactList: {},
});

function ChatListPage(props) {
  const classes = useStyles();

  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const chatList = (await getUserChats()).data;
      console.log(chatList);
      setChats(chatList);
    }
    fetchData();
  }, []);

  const activeChats = chats.map((chat) => {
    let anotherUser;
    if (chat.participants[0].id == props.userData.id) {
      anotherUser = chat.participants[1];
    } else {
      anotherUser = chat.participants[0];
    }
    const displayName = anotherUser.display_name;
    const chatPicture = anotherUser.profile_picture;

    return (
      <ChatComponent
        key={chat.id}
        status="online"
        displayName={displayName}
        chatPicture={chatPicture}
        lastMessage={chat.last_message}
        chatUrl={`/chats/${chat.id}`}
      />
    );
  });

  return (
    <Container className={classes.container} maxWidth="md">
      <h1>Chats</h1>
      <AddChatModal />
      <br />
      <ul className={classes.contactList}>{activeChats}</ul>
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

export default connect(mapStateToProps)(ChatListPage);
