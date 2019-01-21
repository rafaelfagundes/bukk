import React from "react";

const ValidationError = props => {
  return (
    <div style={{ color: "red", display: props.show ? "block" : "none" }}>
      {props.error}
    </div>
  );
};

export default ValidationError;
