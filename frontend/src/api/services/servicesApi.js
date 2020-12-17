import axios from "axios";

import { baseUrl } from "../../constants";

export const axiosWithHeader = () => {
  const token = getTokenFromLocalStorage();
  if (token) {
    return axios.create({
      baseURL: baseUrl,
      headers: {
        // "Content-Type": "application/json",
        Authorization: "Bearer " + getTokenFromLocalStorage(),
      },
    });
  } else {
    return axios.create({ baseURL: baseUrl });
  }
};

export function setTokenInLocalStorage(token) {
  localStorage.setItem("auth-token", token);
}

export function getTokenFromLocalStorage() {
  return localStorage.getItem("auth-token");
}
