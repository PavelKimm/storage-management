import { axiosWithHeader } from "../services/servicesApi";

export function logout() {
  localStorage.removeItem("auth-token");
}

export const login = async (phoneNumber, password) => {
  return axiosWithHeader()
    .post(`login/`, {
      phone_number: phoneNumber,
      password,
    })
    .catch((error) => {
      let errorMessage;
      if (
        error.response.data.non_field_errors[0] ===
        "Unable to log in with provided credentials."
      ) {
        errorMessage = "Invalid credentials!";
      } else {
        errorMessage = error.response.data.non_field_errors[0];
      }
      throw errorMessage;
    });
};

export const register = async (
  phoneNumber,
  confirmationCode,
  name,
  password,
  password2,
  userType = 0 // Customer
) => {
  return axiosWithHeader().post(`register/`, {
    phone_number: phoneNumber,
    confirmation_code: confirmationCode,
    name,
    password,
    password2,
    user_type: userType,
  });
};

export const sendConfirmationCode = async (phoneNumber) => {
  return axiosWithHeader().post(`send-code/`, {
    phone_number: phoneNumber,
  });
};

// export const tokenIsValid = async (token) => {
//   return axiosWithHeader.post(`/api/validate-jwt/`, null, {
//     headers: { "x-auth-token": token },
//   });
// };

export const getUserDataFromToken = async () => {
  return axiosWithHeader().get(`users/profile/`);
};

export const getUserData = async () => {
  try {
    let userData = await getUserDataFromToken();
    userData = {
      id: userData.data.id,
      phoneNumber: userData.data.phone_number,
      name: userData.data.name,
      // addresses: userData.data.addresses,
    };
    return userData;
  } catch (err) {
    return undefined;
  }
};
