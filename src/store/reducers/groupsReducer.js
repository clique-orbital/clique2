import {
  INITIALIZE_GROUPS,
  ADD_NEW_GROUP,
  FETCH_GROUP,
  SORT_GROUPS,
  REMOVE_GROUP,
  ADD_MEMBER_TO_GROUP,
  REMOVE_USER_FROM_GROUP_REDUX,
  SIGN_OUT
} from "../constants";
import _ from "lodash";

const initialState = {
  groups: {}
};

export const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_OUT:
      return initialState;
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
    case SORT_GROUPS:
      const sortedArr = Object.values(state.groups).sort(
        (a, b) => b.last_message.timestamp - a.last_message.timestamp
      );
      const sortedGroups = {};
      sortedArr.forEach(group => {
        sortedGroups[group.groupID] = group;
      });
      return { ...state, groups: sortedGroups };
    case REMOVE_GROUP:
      return _.omit(state, action.payload);
    case REMOVE_USER_FROM_GROUP_REDUX:
      const groupID = action.payload.groupID;
      return {
        ...state,
        groups: {
          ...state.groups,
          [groupID]: {
            ...state.groups[groupID],
            users: _.omit(state.groups[groupID].users, action.payload.uid)
          }
        }
      };
    case ADD_MEMBER_TO_GROUP:
      const uid = action.payload.uid;
      const groupid = action.payload.groupID;
      return {
        ...state,
        groups: {
          ...state.groups,
          [groupid]: {
            ...state.groups[groupid],
            users: { ...state.groups[groupid].users, [uid]: true }
          }
        }
      };
    default:
      return state;
  }
};
