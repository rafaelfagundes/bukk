import { combineReducers } from "redux";

import authReducer from "./authReducer";
import clientReducer from "./components/Dashboard/Clients/clientReducer";
import bookerReducer from "./components/Booker/bookerReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  client: clientReducer,
  booker: bookerReducer
});

export default rootReducer;
