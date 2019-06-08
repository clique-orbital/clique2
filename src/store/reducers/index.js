import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { authReducer } from "./authReducer";
import { groupsReducer } from "./groupsReducer";
import { messagesReducer } from "./messagesReducer";

export default combineReducers({ 
    authReducer, 
    groupsReducer,
    messagesReducer,
    form: formReducer 
});

// {this.props.groups
//     ? <FlatList
//       data={this.props.groups}
//       renderItem={this.renderRow}
//       keyExtractor={(item, index) => index.toString()}
//     />
//     : null
//   }