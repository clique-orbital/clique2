import { USER_DETAILS } from "../constants";

const INITIAL_STATE = {
  user: null
};

export const authReducer = (state = INITIAL_STATE, action) => {
  if (action.type === USER_DETAILS) {
    return { ...state, user: action.payload };
  }
  return state;
};
