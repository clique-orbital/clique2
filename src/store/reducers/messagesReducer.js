import { FETCH_CONVERSATION, CHANGE_PREV_DATE } from "../constants";

export const messagesReducer = (state = {}, action) => {
    if(action.type === FETCH_CONVERSATION){
        const groupID = action.payload.groupID;
        return {
            ...state,
            [groupID] :{
                ...state[groupID],
                messages: [...action.payload.messages],
            }

        }
    } else if(action.type === CHANGE_PREV_DATE) {
        const groupID = action.payload.groupID;
        console.log("in changing prev date to " + action.payload.prevDate);
        return {
            ...state,
            [groupID] : {
              ...state[groupID],
              prevDate: action.payload.prevDate
            }
        }
    } else {
        return state;
    }
}
