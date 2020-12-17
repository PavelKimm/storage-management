import axios from "axios";
import { baseUrl } from "../../../constants";
import { getTokenFromLocalStorage } from "../../../api/services/servicesApi";
import { USER_DATA_TYPES } from "./userDataTypes";

export const setUserDataStartAC = () => ({
  type: USER_DATA_TYPES.SET_USER_DATA_START,
});

export const setUserDataSuccessAC = (userData) => {
  return {
    type: USER_DATA_TYPES.SET_USER_DATA_SUCCESS,
    payload: { userData },
  };
};
export const setUserDataErrorAC = () => ({
  type: USER_DATA_TYPES.SET_USER_DATA_ERROR,
});

// redux-thunk
// export const getUserDataThunkAC = () => async (dispatch) => {
//   let token = getTokenFromLocalStorage();
//   let result;
//   if (token) {
//     const tokenRes = await axios.post(baseUrl + `/api/validate-jwt/`, null, {
//       headers: { "x-auth-token": token },
//     });
//     if (tokenRes.data) {
//       const userData = await axios.get(baseUrl + `/api/current-user/`, {
//         headers: { "x-auth-token": token },
//       });
//       result = { userData: userData.data };
//     }
//   } else {
//     console.log("You are not logged in!");
//     result = { userData: undefined };
//   }

//   dispatch(setUserDataAC(result));
// };
