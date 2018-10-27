export const setPage = page => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_PAGE",
      page
    });
  };
};
