import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function AddChatForm() {
  const classes = useStyles();

  const [usernames, setUsernames] = useState([]);
  const [error, setError] = useState();

  function handleChangeUsernames(e) {
    setUsernames(e.target.value);
  }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Input
        placeholder="username..."
        inputProps={{ "aria-label": "description" }}
      />
      <button className={classes} type="submit">
        Start a chat
      </button>
    </form>
  );
}
