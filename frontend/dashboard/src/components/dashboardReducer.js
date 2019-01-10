import assign from "lodash/assign";

const initialState = {
  user: {
    fistName: "",
    lastName: ""
  }
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return assign({}, state, action);
    default:
      break;
  }
  return state;
};

export default dashboardReducer;
