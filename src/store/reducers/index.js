import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { authReducer } from "./authReducer";
import { groupsReducer } from "./groupsReducer";

export default combineReducers({ 
    authReducer, 
    groupsReducer, 
    form: formReducer 
});

// export default combineReducers({ 
//     authReducer, 
//     form: formReducer 
// });
