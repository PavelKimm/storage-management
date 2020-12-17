import { USER_DATA_TYPES } from "../../actions/userData/userDataTypes";

export default function (state = {}, action) {
  switch (action.type) {
    case USER_DATA_TYPES.SET_USER_DATA_START:
      return { ...state, loading: true, error: false };
    case USER_DATA_TYPES.SET_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        id: action.payload.userData.id,
        displayName:
          action.payload.userData.name || action.payload.userData.phoneNumber,
      };
    case USER_DATA_TYPES.SET_USER_DATA_ERROR:
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
}
