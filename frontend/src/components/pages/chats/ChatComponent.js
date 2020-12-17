import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
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

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    paddingTop: 10,
    fontSize: 18,
  },
  link: { color: "inherit", textDecoration: "none" },

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
}));

function ChatComponent(props) {
  const classes = useStyles();

  console.log(props.lastMessage);

  return (
    <li className={classes}>
      <Link to={props.chatUrl} className={classes.link}>
        {props.displayName}
      </Link>
    </li>
  );
}

export default ChatComponent;
