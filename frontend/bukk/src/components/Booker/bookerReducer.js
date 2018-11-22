import assign from "lodash/assign";

const initialState = {
  page: "1",

  companyData: {
    business: {
      logo: ""
    }
  },
  totalValue: 0.0,
  currentService: 0,
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
    case "SET_TIME_TABLE":
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
    default:
      break;
  }
  return state;
};

export default bookerReducer;
