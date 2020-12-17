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

import { login, getUserData } from "../../../api/auth/authApi";
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
    marginTop: "65px",
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
  },
  loginButton: {
    margin: "1.4vw 0 1vw",
    color: "white",
    backgroundColor: "#f7d600",
    boxShadow: "none",
    "&:hover": { backgroundColor: "#eacb00" },
    height: "60px",
    borderRadius: "14px",
  },
  forgotPassword: {
    marginTop: "0.5vw",
    textAlign: "center",
  },
  link: {
    margin: "auto",
    color: "grey",
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
  registerButton: {
    marginTop: "10px",
    color: "#949494",
    backgroundColor: "#eae7e7",
    boxShadow: "none",
    "&:hover": { backgroundColor: "#dadada" },
    height: "60px",
    borderRadius: "14px",
  },
}));

function LoginPage(props) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.userData.id) history.push("/");
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  function onChangePhoneNumber(e) {
    setPhoneNumber(e.target.value);
  }

  function onChangePassword(e) {
    setPassword(e.target.value);
  }

  function handleLogin(e) {
    e.preventDefault();
    dispatch(setUserDataStartAC());
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
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <div className={classes.authContainer}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} onSubmit={handleLogin}>
          <TextField
            className={classes.formTextField}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone number"
            name="phoneNumber"
            autoComplete="phoneNumber"
            autoFocus
            value={phoneNumber}
            onChange={onChangePhoneNumber}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={onChangePassword}
          />

          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <div className={classes.forgotPassword}>
            <Link to="/reset-password" className={classes.link} variant="body2">
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.loginButton}
          >
            Login
          </Button>
          <div className={classes.orDividerOuter}>
            <div className={classes.orDividerInner}>
              <hr className={classes.hr} />
              <div className={classes.orHrDiv}>or</div>
              <hr className={classes.hr} />
            </div>
          </div>
          <Link to="/register" className={classes.link}>
            <Button
              fullWidth
              variant="contained"
              className={classes.registerButton}
            >
              Register
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

export default connect(mapStateToProps)(LoginPage);
