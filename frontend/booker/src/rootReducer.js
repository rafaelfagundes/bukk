import { combineReducers } from "redux";

import bookerReducer from "./components/bookerReducer";

const rootReducer = combineReducers({
  booker: bookerReducer
});

export default rootReducer;
