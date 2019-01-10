export const setUser = user => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_USER",
      user
    });
  };
};
