import { POPULATE_GROUPS, INCREMENT_COUNT, SET_TO_ZERO } from "../constants";

export const incrementCount = groupID => {
  return {
    type: INCREMENT_COUNT,
    payload: groupID
  };
};

export const setToZero = groupID => {
  return {
    type: SET_TO_ZERO,
    payload: groupID
  };
};

export const populateGroups = g => {
  const groups = {};
  Object.keys(g).forEach(group => (groups[group] = 0));
  return {
    type: POPULATE_GROUPS,
    payload: groups
  };
};
