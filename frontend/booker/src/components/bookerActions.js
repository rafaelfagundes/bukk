export const setPage = page => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_PAGE",
      page
    });
  };
};

export const setIsMobile = isMobile => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_IS_MOBILE",
      isMobile
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

export const setServices = services => {
  return (dispatch, getState) => {
    dispatch({ type: "SET_SERVICES", services });
  };
};

export const setSpecialists = specialists => {
  return (dispatch, getState) => {
    dispatch({ type: "SET_SPECIALISTS", specialists });
  };
};

export const setAppointment = appointment => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_APPOINTMENT",
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
