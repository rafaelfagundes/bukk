export const addClient = client => {
  console.log(client);
  return (dispatch, getState) => {
    // make async call
    console.log("ADD_CLIENT clientActions.js");
    dispatch({
      type: "ADD_CLIENT",
      client
    });
  };
};

export const allClients = clients => {
  console.log(clients);
  return (dispatch, getState) => {
    // make async call
    console.log("GET_ALL_CLIENTS clientActions.js");
    dispatch({
      type: "GET_ALL_CLIENTS",
      clients
    });
  };
};
