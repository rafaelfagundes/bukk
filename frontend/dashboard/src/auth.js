export const isAuthenticated = () => {
  if (localStorage.getItem("token")) {
    return true;
  } else {
    localStorage.removeItem("user");
    return false;
  }
};
