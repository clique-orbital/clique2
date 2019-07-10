import { TOGGLE_POLL_MODAL } from "../constants";

const initialState = {
  modalVisibility: false
}

export const pollModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_POLL_MODAL:
      return {
        ...state,
        modalVisibility: action.payload.mode,
      }
    default:
      return state;
  }
}