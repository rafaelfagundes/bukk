export const setUser = user => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_USER",
      user
    });
  };
};

export const setCurrentPage = currentPage => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_CURRENTPAGE",
      currentPage
    });
  };
};
