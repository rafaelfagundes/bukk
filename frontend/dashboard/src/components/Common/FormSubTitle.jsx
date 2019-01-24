import React from "react";

const FormSubTitle = props => {
  const style = {
    fontSize: "1rem",
    padding: props.first ? "0px 0px 5px 0" : "10px 0px 5px 0",
    margin: props.first ? "0 0 10px 0" : "20px 0 10px 0",
    fontWeight: "600"
  };

  return <div style={style}>{props.text}</div>;
};

export default FormSubTitle;
