export const setPage = page => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_PAGE",
      page
    });
  };
};

export const setCompanyData = companyData => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_COMPANY_DATA",
      companyData
    });
  };
};

export const setTimeTable = timeTable => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_TIME_TABLE",
      timeTable
    });
  };
};

export const setTime = appointment => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_TIME",
      appointment
    });
  };
};
