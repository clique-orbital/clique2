import { USER_DETAILS, SIGN_OUT } from "../constants";

const INITIAL_STATE = {
  user: null
};

export const authReducer = (state = INITIAL_STATE, action) => {
  if (action.type === USER_DETAILS) {
    return { ...state, user: action.payload };
  } else if (action.type === SIGN_OUT) {
    return { ...state, user: INITIAL_STATE };
  }
  return state;
};
