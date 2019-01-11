import assign from "lodash/assign";

const initialState = {
  user: {
    fistName: "",
    lastName: ""
  },
  currentPage: {
    title: "Início",
    icon: "home"
  }
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return assign({}, state, action);
    case "SET_CURRENTPAGE":
      return assign({}, state, action);
    default:
      break;
  }
  return state;
};

export default dashboardReducer;
