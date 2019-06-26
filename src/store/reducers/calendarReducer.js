import { FETCH_EVENTS, CLEAR_EVENTS, STORE_PERSONAL_EVENTS } from "../constants";

const initialState = {
  events: {}
};

export const calendarReducer = (state = initialState, action) => {
  if (action.type === FETCH_EVENTS) {
    return {
      ...state,
      events: { ...state.events, [action.groupid]: action.events }
    };
  } else if (action.type === CLEAR_EVENTS) {
    return { ...state, events: {} };
  } else if (action.type === STORE_PERSONAL_EVENTS) {
    return { ...state, personalEvents: action.payload }
  }
  return state;
};
