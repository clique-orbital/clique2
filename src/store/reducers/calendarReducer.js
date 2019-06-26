import { FETCH_EVENTS, CLEAR_EVENTS, STORE_PERSONAL_EVENTS, REMOVE_GROUP_EVENTS } from "../constants";
import _ from "lodash";

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
  } else if (action.type === REMOVE_GROUP_EVENTS) {
    return _.omit(state, action.payload);
  }
  return state;
};
