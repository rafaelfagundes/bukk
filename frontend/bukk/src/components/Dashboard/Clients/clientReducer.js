import assign from "lodash/assign";

const initialState = {
  clients: []
};

const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_CLIENT":
      return assign({}, state, {
        clients: [...state.clients, action.client]
      });
    case "GET_ALL_CLIENTS":
      console.log("GET_ALL_CLIENTS clientReducer.js");
      return assign({}, state, action);
    default:
      break;
  }
  return state;
};

export default clientReducer;
