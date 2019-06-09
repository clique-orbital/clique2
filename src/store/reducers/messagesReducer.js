import { FETCH_CONVERSATION, FETCH_NEW_MESSAGE } from "../constants";

export const messagesReducer = (state = {}, action) => {
    if(action.type === FETCH_CONVERSATION){
        const groupID = action.payload.groupID;
        console.log(state[groupID]);
        return {
            ...state,
            [groupID] :[...action.payload.messages],
        }
    } else if (action.type === FETCH_NEW_MESSAGE) {
        const groupID = action.payload.groupID;
        const prevConvo = state[groupID]|| [];
        return {
            ...state,
            [groupID] : prevConvo.concat(action.payload.message) ,
        }
    } else {
        return state;
    }
}
