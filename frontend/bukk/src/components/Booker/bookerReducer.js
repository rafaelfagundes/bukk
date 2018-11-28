import assign from "lodash/assign";

const initialState = {
  page: "3",
  currentService: 0,

  dateAndTimeOk: false,
  personalInfoOk: false,
  confirmationOk: false,

  companyData: {
    business: {
      logo: ""
    }
  },

  errors: false,

  appointment: {
    client: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      whatsapp: false,
      obs: ""
    },
    services: []
  }
};

const bookerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return assign({}, state, action);
    case "SET_CURRENT_SERVICE":
      return assign({}, state, action);
    case "SET_TIME":
      return assign({}, state, action);
    case "SET_DATE":
      return assign({}, state, action);
    case "SET_SERVICE":
      return assign({}, state, action);
    case "SET_CLIENT":
      return assign({}, state, action);
    case "SET_COMPANY_DATA":
      return assign({}, state, action);
    case "SET_DATE_TIME_OK":
      return assign({}, state, action);
    case "SET_PERSONAL_INFO_OK":
      return assign({}, state, action);
    case "SET_CONFIRMATION_OK":
      return assign({}, state, action);
    default:
      break;
  }
  return state;
};

export default bookerReducer;
