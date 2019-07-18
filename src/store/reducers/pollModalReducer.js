import { TOGGLE_POLL_MODAL, UPDATE_POLL } from "../constants";

const initialState = {
  modalVisibility: false,
  poll: {
    options: []
  }
};

export const pollModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_POLL_MODAL:
      return {
        ...state,
        modalVisibility: action.payload.mode,
        poll: action.payload.poll
      };
    case UPDATE_POLL:
      console.log(action.payload)
      return {
        ...state,
        poll: action.payload
      };
    default:
      return state;
  }
};
