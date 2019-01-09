export const isAuthenticated = () => {
  console.log(localStorage.getItem("token"));
  if (localStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
};
