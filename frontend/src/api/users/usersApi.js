import { axiosWithHeader } from "../services/servicesApi";

export const getUsers = async () => {
  return axiosWithHeader()
    .get(`users/`)
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
