import { combineReducers } from "redux";
import isAuthedReducer from "./isAuthed/isAuthedReducer";
import snackbarReducer from "./snackbars/snackbarReducer";
import userDataReducer from "./userData/userDataReducer";

export default combineReducers({
  isAuthedReducer,
  snackbarReducer,
  userDataReducer,
});
