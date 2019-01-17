import React from "react";

const FormTitle = props => {
  const style = {
    fontSize: "1.2rem",
    borderBottom: "1px solid #eee",
    padding: "10px 0px 5px 0",
    margin: props.first ? "0px 0 20px 0" : "20px 0 20px 0",
    fontWeight: 300
  };

  return <div style={style}>{props.text}</div>;
};

export default FormTitle;
