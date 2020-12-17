import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import {
  login,
  register,
  getUserData,
  sendConfirmationCode,
} from "../../../api/auth/authApi";
import { setTokenInLocalStorage } from "../../../api/services/servicesApi";
import {
  setUserDataStartAC,
  setUserDataSuccessAC,
  setUserDataErrorAC,
} from "../../../redux/actions/userData/userDataActions";
import { setSnackbarMessageAC } from "../../../redux/actions/snackbars/snackbarActions";
import { SEVERITY } from "../../../redux/actions/snackbars/snackbarTypes";
import {
  setIsAuthedFalseAC,
  setIsAuthedTrueAC,
} from "../../../redux/actions/isAuthed/isAuthedActions";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },

  authContainer: {
    margin: "0 auto",
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "24vw",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  formTextField: {
    borderRadius: "14px",
    color: "red",
    marginBottom: 0,
  },
  primaryButton: {
    margin: "1.4vw 0 1vw",
    color: "white",
    backgroundColor: "#f7d600",
    boxShadow: "none",
    "&:hover": { backgroundColor: "#eacb00" },
    height: "60px",
    borderRadius: "14px",
  },
  sendConfirmationCode: {
    textAlign: "right",
  },
  link: {
    cursor: "pointer",
    margin: "auto",
    color: "#0000c5",
    textDecoration: "none",
    "div > &:hover": { textDecoration: "underline" },
  },
  orDividerOuter: {
    textAlign: "center",
  },
  orDividerInner: {
    textAlign: "center",
    display: "inline-block",
  },
  hr: {
    float: "left",
    marginTop: "13px",
    border: "1px solid #d2cfcf",
    borderRadius: "2px",
    width: "8vw",
  },
  orHrDiv: {
    float: "left",
    width: "3vw",
    fontSize: "18px",
    color: "#aba7a7",
  },
  secondaryButton: {
    marginTop: "10px",
    color: "#949494",
    backgroundColor: "#eae7e7",
    boxShadow: "none",
    "&:hover": { backgroundColor: "#dadada" },
    height: "60px",
    borderRadius: "14px",
  },
}));

function RegisterPage(props) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.userData.id) history.push("/");
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  function onChangePhoneNumber(e) {
    setPhoneNumber(e.target.value);
  }
  function onChangeConfirmationCode(e) {
    setConfirmationCode(e.target.value);
  }
  function onChangeName(e) {
    setName(e.target.value);
  }
  function onChangePassword(e) {
    setPassword(e.target.value);
  }
  function onChangePassword2(e) {
    setPassword2(e.target.value);
  }

  async function handleSendConfirmationCode(e) {
    try {
      await sendConfirmationCode(phoneNumber);
    } catch (error) {
      dispatch(setUserDataErrorAC());
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
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    dispatch(setUserDataStartAC());

    await register(phoneNumber, confirmationCode, name, password, password2)
      .then(() => {
        login(phoneNumber, password)
          .then(async (res) => {
            setTokenInLocalStorage(res.data.access);
            dispatch(setIsAuthedTrueAC());
            const userData = await getUserData();
            dispatch(setUserDataSuccessAC(userData));
            history.push("/");
          })
          .catch((error) => {
            dispatch(setUserDataErrorAC());
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
      })
      .catch((error) => {
        dispatch(setUserDataErrorAC());
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
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <div className={classes.authContainer}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} onSubmit={handleRegister}>
          <TextField
            className={classes.formTextField}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone number"
            name="phoneNumber"
            autoFocus
            value={phoneNumber}
            onChange={onChangePhoneNumber}
          />
          <div className={classes.sendConfirmationCode}>
            <span
              onClick={handleSendConfirmationCode}
              className={classes.link}
              variant="body2"
            >
              Send confirmation code
            </span>
          </div>
          <TextField
            className={classes.formTextField}
            variant="outlined"
            margin="normal"
            fullWidth
            id="confirmationCode"
            label="Confirmation code"
            name="confirmationCode"
            value={confirmationCode}
            onChange={onChangeConfirmationCode}
          />
          <TextField
            className={classes.formTextField}
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            label="Name"
            name="name"
            value={name}
            onChange={onChangeName}
          />
          <TextField
            className={classes.formTextField}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={onChangePassword}
          />
          <TextField
            className={classes.formTextField}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Repeat password"
            type="password"
            id="password2"
            value={password2}
            onChange={onChangePassword2}
          />

          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.primaryButton}
          >
            Register
          </Button>
          <div className={classes.orDividerOuter}>
            <div className={classes.orDividerInner}>
              <hr className={classes.hr} />
              <div className={classes.orHrDiv}>or</div>
              <hr className={classes.hr} />
            </div>
          </div>
          <Link to="/login" className={classes.link}>
            <Button
              fullWidth
              variant="contained"
              className={classes.secondaryButton}
            >
              Login
            </Button>
          </Link>
        </form>
      </div>
    </Grid>
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

export default connect(mapStateToProps)(RegisterPage);
