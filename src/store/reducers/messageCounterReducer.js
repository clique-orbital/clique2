import { POPULATE_GROUPS, INCREMENT_COUNT, SET_TO_ZERO } from "../constants";

const INITIAL_STATE = { groups: {} };

export const messageCounterReducer = (state = INITIAL_STATE, action) => {
  if (action.type === INCREMENT_COUNT) {
    const groupID = action.payload;
    return {
      ...state,
      groups: {
        ...state.groups,
        [groupID]: state.groups[groupID] + 1
      }
    };
  } else if (action.type === SET_TO_ZERO) {
    const groupID = action.payload;
    return {
      ...state,
      groups: {
        ...state.groups,
        [groupID]: 0
      }
    };
  } else if (action.type === POPULATE_GROUPS) {
    return { ...state, groups: action.payload };
  }
  return state;
};
