import { USER_DETAILS, SET_PICTURE, SET_USERNAME } from "../constants";

// action creator for authDetails for the phone authentication
// response from sign in after code is sent
export const setUserDetails = userDetails => {
  return {
    type: USER_DETAILS,
    payload: userDetails
  };
};

export const setUsername = username => {
  return {
    type: SET_USERNAME,
    payload: username
  };
};
