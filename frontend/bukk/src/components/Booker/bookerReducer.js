import assign from "lodash/assign";

const initialState = {
  page: "1",
  totalValue: 0.0,
  numPages: 3
};

const bookerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return assign({}, state, action);
    default:
      break;
  }
  return state;
};

export default bookerReducer;
