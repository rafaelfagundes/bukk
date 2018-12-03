export const setSomething = x => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_SOMETHING",
      x
    });
  };
};

export const addClient = x => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_SOMETHING",
      x
    });
  };
};

export const allClients = x => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_SOMETHING",
      x
    });
  };
};
