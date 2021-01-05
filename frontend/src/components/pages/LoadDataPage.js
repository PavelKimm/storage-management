import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

// import Dropzone from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";

import { setSnackbarMessageAC } from "../../redux/actions/snackbars/snackbarActions";

import { loadData } from "../../api/dataParsing/dataParsingApi";
import { SEVERITY } from "../../redux/actions/snackbars/snackbarTypes";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: 10,
    fontSize: 18,
    width: "70vw",
    flexGrow: 1,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  loadButton: {
    margin: "1.4vw 0 1vw",
    textAlign: "center",
    color: "white",
    backgroundColor: "#f7d600",
    boxShadow: "none",
    "&:hover": { backgroundColor: "#eacb00" },
    height: "40px",
    width: "200px",
    borderRadius: "14px",
  },
  title: { textAlign: "center" },
  link: { color: "inherit", textDecoration: "none" },
}));

export default function LoadDataPage() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);

  function onChangeFiles(e) {
    setFiles(e.target.value);
    console.log(e.target.value);
    console.log(files);
  }

  function onSubmitHandler(e) {
    e.preventDefault();

    loadData(files)
      .then(async (res) => {
        dispatch(
          setSnackbarMessageAC({
            msg: res,
            severity: SEVERITY.SUCCESS,
          })
        );
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch(
          setSnackbarMessageAC({
            msg: resMessage,
            severity: SEVERITY.ERROR,
          })
        );
      });
  }

  return (
    <Container className={classes.container} maxWidth="lg">
      <h2 className={classes.title}>Load data</h2>
      <div className="mb-3" />
      <form className={classes.form} onSubmit={onSubmitHandler}>
        <input
          className={classes.formTextField}
          variant="outlined"
          margin="normal"
          required
          id="files"
          type="file"
          label="Files"
          name="files"
          autoFocus
          value={files}
          multiple
          onChange={onChangeFiles}
        />
        <br />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.loadButton}
        >
          Load
        </Button>
      </form>
    </Container>
  );
}
