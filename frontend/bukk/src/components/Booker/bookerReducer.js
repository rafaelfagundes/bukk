import assign from "lodash/assign";

const initialState = {
  page: "1",
  totalValue: 0.0,
  numPages: 3,
  timeTable: [],
  startTime: 8,
  endTime: 18,
  minTimeFrame: 15,
  excludeTimes: [
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45"
  ]
};

const bookerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return assign({}, state, action);
    case "SET_TIME_TABLE":
      return assign({}, state, action);
    default:
      break;
  }
  return state;
};

export default bookerReducer;
