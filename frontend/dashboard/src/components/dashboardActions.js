export const setUser = user => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_USER",
      user
    });
  };
};

export const setEmployee = employee => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_EMPLOYEE",
      employee
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
