import { combineReducers } from "redux";

import authReducer from "./authReducer";
import clientReducer from "./components/Clients/clientReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  client: clientReducer
});

export default rootReducer;
