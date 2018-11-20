import assign from "lodash/assign";
import moment from "moment";

const initialState = {
  page: "1",
  numPages: 3,
  companyData: {
    business: {
      logo: ""
    }
  },
  totalValue: 0.0,
  timeTable: [
    { time: "8:00", selected: false },
    { time: "8:15", selected: false },
    { time: "8:30", selected: false },
    { time: "8:45", selected: false },
    { time: "9:00", selected: false },
    { time: "9:15", selected: false },
    { time: "9:30", selected: false },
    { time: "9:45", selected: false },
    { time: "10:00", selected: false },
    { time: "10:15", selected: false },
    { time: "10:30", selected: false },
    { time: "10:45", selected: false },
    { time: "11:00", selected: false },
    { time: "11:15", selected: false },
    { time: "11:30", selected: false },
    { time: "11:45", selected: false },
    { time: "15:00", selected: false },
    { time: "15:15", selected: false },
    { time: "15:30", selected: false },
    { time: "15:45", selected: false },
    { time: "16:00", selected: false },
    { time: "16:15", selected: false },
    { time: "16:30", selected: false },
    { time: "16:45", selected: false },
    { time: "17:00", selected: false },
    { time: "17:15", selected: false },
    { time: "17:30", selected: false },
    { time: "17:45", selected: false }
  ],
  currentService: 0,
  excludeTimes: [
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45"
  ],
  appointment: {
    services: [
      {
        serviceId: "",
        dateAndTime: {
          time: "",
          date: moment().format("DD-MM-YYYY")
        },
        specialist: null
      }
    ]
  }
};

const bookerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return assign({}, state, action);
    case "SET_TIME_TABLE":
      return assign({}, state, action);
    case "SET_TIME":
      return assign({}, state, action);
    case "SET_DATE":
      return assign({}, state, action);
    case "SET_SERVICE":
      return assign({}, state, action);
    case "SET_COMPANY_DATA":
      return assign({}, state, action);
    default:
      break;
  }
  return state;
};

export default bookerReducer;
