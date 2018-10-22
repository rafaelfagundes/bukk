import { combineReducers } from "redux";

import authReducer from "./authReducer";
import clientReducer from "./clientReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  client: clientReducer
});

export default rootReducer;
