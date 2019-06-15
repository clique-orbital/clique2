import { FETCH_EVENTS } from "../constants";

const initialState = {
  events: {}
};

export const calendarReducer = (state = initialState, action) => {
  if (action.type === FETCH_EVENTS) {
    return { ...state, events: action.payload };
  }
  return state;
};
