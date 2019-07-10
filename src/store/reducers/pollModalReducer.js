import { TOGGLE_POLL_MODAL } from "../constants";

const initialState = {
  modalVisibility: false,
  poll: {}
}

export const pollModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_POLL_MODAL:
      return {
        ...state,
        modalVisibility: action.payload.mode,
        poll: action.payload.poll
      }
    default:
      return state;
  }
}