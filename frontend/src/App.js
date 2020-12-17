import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { fade, makeStyles } from "@material-ui/core/styles";

import {
  setUserDataStartAC,
  setUserDataSuccessAC,
  setUserDataErrorAC,
  // getUserDataThunkAC,
} from "./redux/actions/userData/userDataActions";
import {
  setIsAuthedTrueAC,
  setIsAuthedFalseAC,
} from "./redux/actions/isAuthed/isAuthedActions";
import { setSnackbarMessageAC } from "./redux/actions/snackbars/snackbarActions";
import { logout, getUserData } from "./api/auth/authApi";
import { getTokenFromLocalStorage } from "./api/services/servicesApi";

import Header from "./components/layout/Header";
import Main from "./components/layout/Main";
import Footer from "./components/layout/Footer";
import CustomSnackbar from "./components/snackbars/CustomSnackbar";
import { SEVERITY } from "./redux/actions/snackbars/snackbarTypes";

function App(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function setUserData() {
      if (!props.userData.id) {
        dispatch(setUserDataStartAC());
        try {
          const userData = await getUserData();
          if (userData) dispatch(setUserDataSuccessAC(userData));
          else {
            dispatch(setIsAuthedFalseAC());
            if (getTokenFromLocalStorage()) {
              dispatch(
                setSnackbarMessageAC({
                  msg: "Invalid auth token! Please, log in again.",
                  severity: SEVERITY.ERROR,
                })
              );
              logout();
            }
            dispatch(setUserDataErrorAC());
          }
        } catch (error) {
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
    }
    if (getTokenFromLocalStorage()) {
      dispatch(setIsAuthedTrueAC());
      setUserData();
    }
  }, []);

  //   const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  //   const toggleDrawerOpened = () => {
  //     setIsDrawerOpened(!isDrawerOpened);
  //   };

  return (
    <div>
      <Header />
      <Main />
      {/*<Footer />*/}

      <CustomSnackbar />
    </div>
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

export default connect(mapStateToProps)(App);
