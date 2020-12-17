import axios from "axios";
import { baseUrl } from "../../../constants";
import { SNACKBAR_MESSAGE_TYPES } from "./snackbarTypes";

export const setSnackbarMessageAC = ({ msg, severity }) => {
  return {
    type: SNACKBAR_MESSAGE_TYPES.SET_SNACKBAR_MESSAGE,
    payload: { msg, severity },
  };
};

export const setSnackbarEmptyAC = () => {
  return {
    type: SNACKBAR_MESSAGE_TYPES.SET_SNACKBAR_MESSAGE_EMPTY,
  };
};
