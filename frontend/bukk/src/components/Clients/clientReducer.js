const initState = {
  clients: [
    { id: "1", email: "john@gmail.com", firstName: "John", lastName: "Silva" },
    { id: "2", email: "mary@gmail.com", firstName: "Mary", lastName: "Silva" },
    { id: "3", email: "tom@gmail.com", firstName: "Tom", lastName: "Silva" },
    { id: "4", email: "max@gmail.com", firstName: "Max", lastName: "Silva" }
  ]
};

const clientReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_CLIENT":
      // do something
      console.log("created client");
      break;

    default:
      break;
  }
  return state;
};

export default clientReducer;
