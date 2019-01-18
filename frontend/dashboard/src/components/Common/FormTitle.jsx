import React from "react";

const FormTitle = props => {
  const style = {
    fontSize: "1.2rem",
    borderBottom: "2px solid #eee",
    padding: "0px 0px 5px 0",
    margin: props.first ? "0px 0 25px 0" : "50px 0 25px 0",
    fontWeight: 400,
    color: "#555"
  };

  return <div style={style}>{props.text}</div>;
};

export default FormTitle;
