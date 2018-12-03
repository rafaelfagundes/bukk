import { combineReducers } from "redux";

import dashboardReducer from "./components/dashboardReducer";

const rootReducer = combineReducers({
  dashboard: dashboardReducer
});

export default rootReducer;
