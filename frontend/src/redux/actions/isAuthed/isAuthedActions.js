import { IS_AUTHED_TYPES } from "./isAuthedTypes";

export const setIsAuthedTrueAC = () => ({
  type: IS_AUTHED_TYPES.SET_IS_AUTHED_TRUE,
});

export const setIsAuthedFalseAC = () => {
  return {
    type: IS_AUTHED_TYPES.SET_IS_AUTHED_FALSE,
  };
};
