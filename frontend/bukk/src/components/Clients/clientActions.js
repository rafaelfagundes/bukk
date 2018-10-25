export const addClient = client => {
  console.log(client);
  return (dispatch, getState) => {
    // make async call
    dispatch({
      type: "ADD_CLIENT",
      client
    });
  };
};
