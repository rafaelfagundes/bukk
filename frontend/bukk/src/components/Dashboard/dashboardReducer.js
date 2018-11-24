import assign from "lodash/assign";

const initialState = {};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SOMETHING":
      return assign({}, state, action);
    default:
      break;
  }
  return state;
};

export default dashboardReducer;
