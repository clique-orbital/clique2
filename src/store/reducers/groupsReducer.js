import { INITIALIZE_GROUPS, ADD_NEW_GROUP, FETCH_GROUP } from "../constants";

const initialState = {
  groups: {}
};

export const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_GROUPS:
      return {
        ...state,
        groups: action.payload
      };
    case ADD_NEW_GROUP:
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.payload.groupId]: action.payload.group
        }
      };
    case FETCH_GROUP:
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.payload.groupId]: {
            ...state.groups[action.payload.groupId],
            last_message: action.payload.message
          }
        }
      };
    default:
      return state;
  }
};
