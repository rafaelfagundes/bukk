import assign from "lodash/assign";

const initialState = {};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return assign({}, state, action);
    case "SET_USER_AVATAR":
      const user = {
        user: {
          ...state.user,
          avatar: action.avatar.avatar
        }
      };
      return assign({}, state, user);
    case "SET_COMPANY_LOGO":
      console.log(action);
      const company = {
        company: {
          ...state.company,
          logo: action.logo
        }
      };
      console.log(company);
      return assign({}, state, company);
    case "SET_EMPLOYEE":
      return assign({}, state, action);
    case "SET_COMPANY":
      return assign({}, state, action);
    case "SET_CURRENTPAGE":
      return assign({}, state, action);
    default:
      break;
  }
  return state;
};

export default dashboardReducer;
