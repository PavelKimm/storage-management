import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import { setSnackbarEmptyAC } from "../../redux/actions/snackbars/snackbarActions";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

function CustomSnackbar(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { msg, severity } = props;

  const [open, setOpen] = useState(false);
  const [transition, setTransition] = useState(undefined);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      dispatch(setSnackbarEmptyAC());
    }, 200);
  };

  useEffect(() => {
    if (msg) {
      setTransition(() => TransitionDown);
      setOpen(true);
    }
  }, [msg]);

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        onClose={handleClose}
        TransitionComponent={transition}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={severity}
        >
          {msg}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    msg: state.snackbarReducer.msg,
    severity: state.snackbarReducer.severity,
  };
}

export default connect(mapStateToProps)(CustomSnackbar);
