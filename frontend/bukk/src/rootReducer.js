import { combineReducers } from "redux";

import dashboardReducer from "./components/Dashboard/dashboardReducer";
import bookerReducer from "./components/Booker/bookerReducer";

const rootReducer = combineReducers({
  client: dashboardReducer,
  booker: bookerReducer
});

export default rootReducer;
