import React from "react";

const FormSubTitle = props => {
  const style = {
    fontSize: "1rem",
    padding: "10px 0px 5px 0",
    margin: "20px 0 20px 0",
    fontWeight: "400"
  };

  return <div style={style}>{props.text}</div>;
};

export default FormSubTitle;
