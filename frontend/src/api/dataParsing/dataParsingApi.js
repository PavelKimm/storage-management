import { axiosWithHeader } from "../services/servicesApi";

export const getActiveProductList = async () => {
  return axiosWithHeader()
    .get(`data-parsing/active-products/`)
    .catch((error) => {
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      throw errorMessage;
    });
};

export const getProductList = async () => {
  return axiosWithHeader()
    .get(`data-parsing/products/`)
    .catch((error) => {
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      throw errorMessage;
    });
};

export const getProductStatistics = async (productId) => {
  return axiosWithHeader()
    .get(`data-parsing/products/` + productId + `/`)
    .catch((error) => {
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      throw errorMessage;
    });
};

// export const login = async (phoneNumber, password) => {
//   return axiosWithHeader()
//     .post(`login/`, {
//       username: phoneNumber,
//       password,
//     })
//     .catch((error) => {
//       let errorMessage;
//       if (
//         error.response.data.non_field_errors[0] ===
//         "Unable to log in with provided credentials."
//       ) {
//         errorMessage = "Invalid credentials!";
//       } else {
//         errorMessage = error.response.data.non_field_errors[0];
//       }
//       throw errorMessage;
//     });
// };
