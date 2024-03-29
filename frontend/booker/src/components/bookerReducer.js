import assign from "lodash/assign";

const initialState = {
  page: "1",
  currentService: 0,
  isMobile: false,

  dateAndTimeOk: false,
  personalInfoOk: false,
  confirmationOk: true,

  companyData: {
    logo: "",
    paymentOptions: [],
    settings: {
      options: {
        disableHeader: false,
        disableLogo: false,
        showCompanyNickname: false
      },
      colors: {
        primary: "#999"
      }
    }
  },

  services: [],
  specialists: [],

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
    services: [],
    companyId: ""
  },

  confirmation: {}
};

const bookerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return assign({}, state, action);
    case "SET_IS_MOBILE":
      return assign({}, state, action);
    case "SET_CURRENT_SERVICE":
      return assign({}, state, action);
    case "SET_APPOINTMENT":
      return assign({}, state, action);
    case "SET_COMPANY_DATA":
      return assign({}, state, action);
    case "SET_SERVICES":
      return assign({}, state, action);
    case "SET_SPECIALISTS":
      return assign({}, state, action);
    case "SET_DATE_TIME_OK":
      return assign({}, state, action);
    case "SET_PERSONAL_INFO_OK":
      return assign({}, state, action);
    case "SET_CONFIRMATION_OK":
      return assign({}, state, action);
    case "SET_CONFIRMATION":
      return assign({}, state, action);
    default:
      break;
  }
  return state;
};

export default bookerReducer;
