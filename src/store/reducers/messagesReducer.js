import { FETCH_CONVERSATION } from "../constants";

export const messagesReducer = (state = {}, action) => {
    switch(action.type) {
        case FETCH_CONVERSATION:
            const { groupID } = action.payload;
            const prevConvo = state[groupID]|| [];
            return {
                ...state,
                [groupID] :[...prevConvo, action.payload.messages],
            }
        default:
            return state;
    }
}
