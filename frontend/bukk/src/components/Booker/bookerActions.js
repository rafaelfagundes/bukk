export const setPage = page => {
  console.log(page);
  return (dispatch, getState) => {
    // make async call
    console.log("SET_PAGE bookerActions.js");
    dispatch({
      type: "SET_PAGE",
      page
    });
  };
};
