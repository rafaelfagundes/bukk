export const setUser = user => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_USER",
      user
    });
  };
};

export const setUserAvatar = avatar => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_USER_AVATAR",
      avatar
    });
  };
};

export const setCompanyLogo = logo => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_COMPANY_LOGO",
      logo
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

export const setCompany = company => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_COMPANY",
      company
    });
  };
};
