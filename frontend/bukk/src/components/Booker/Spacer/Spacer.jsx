import React from "react";

const Spacer = props => {
  return (
    <div
      style={{
        display: "inline-block",
        width: "100%",
        height: props.height + "px"
      }}
    />
  );
};

export default Spacer;
