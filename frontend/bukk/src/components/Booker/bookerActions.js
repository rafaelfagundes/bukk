export const setPage = page => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_PAGE",
      page
    });
  };
};

export const setCurrentService = currentService => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_CURRENT_SERVICE",
      currentService
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

export const setTime = appointment => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_TIME",
      appointment
    });
  };
};

export const setDate = appointment => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_DATE",
      appointment
    });
  };
};

export const setService = appointment => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_SERVICE",
      appointment
    });
  };
};

export const setClient = appointment => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_CLIENT",
      appointment
    });
  };
};

export const setDateTimeOk = dateAndTimeOk => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_DATE_TIME_OK",
      dateAndTimeOk
    });
  };
};

export const setPersonalInfoOk = personalInfoOk => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_PERSONAL_INFO_OK",
      personalInfoOk
    });
  };
};

export const setConfirmationOk = confirmationOk => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_CONFIRMATION_OK",
      confirmationOk
    });
  };
};

export const setConfirmation = confirmation => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_CONFIRMATION",
      confirmation
    });
  };
};
