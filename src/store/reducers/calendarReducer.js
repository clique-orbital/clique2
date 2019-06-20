import { FETCH_EVENTS, CLEAR_EVENTS } from "../constants";

const initialState = {
  events: {}
};

export const calendarReducer = (state = initialState, action) => {
  if (action.type === FETCH_EVENTS) {
    return { ...state, events: action.payload };
  } else if (action.type === CLEAR_EVENTS) {
    return { ...state, events: {} };
  }
  return state;
};
