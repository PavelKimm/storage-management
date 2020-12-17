import { IS_AUTHED_TYPES } from "../../actions/isAuthed/isAuthedTypes";

export default function (state = {}, action) {
  switch (action.type) {
    case IS_AUTHED_TYPES.SET_IS_AUTHED_TRUE:
      return {
        ...state,
        isAuthed: true,
      };
    case IS_AUTHED_TYPES.SET_IS_AUTHED_FALSE:
      return {
        ...state,
        isAuthed: false,
      };
    default:
      return state;
  }
}
