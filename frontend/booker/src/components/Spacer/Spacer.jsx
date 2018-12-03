import React from "react";

const Spacer = props => (
  <div
    style={{
      display: "inline-block",
      width: "100%",
      height: props.height + "px",
      clear: "both",
      position: "relative"
    }}
  />
);

Spacer.defaultProps = {
  height: 50
};

export default Spacer;
