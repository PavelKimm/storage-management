import { SNACKBAR_MESSAGE_TYPES } from "../../actions/snackbars/snackbarTypes";

export default function (state = {}, action) {
  switch (action.type) {
    case SNACKBAR_MESSAGE_TYPES.SET_SNACKBAR_MESSAGE:
      return {
        ...state,
        msg: action.payload.msg,
        severity: action.payload.severity,
      };
    case SNACKBAR_MESSAGE_TYPES.SET_SNACKBAR_MESSAGE_EMPTY:
      return {
        ...state,
        msg: undefined,
        severity: undefined,
      };
    default:
      return state;
  }
}
