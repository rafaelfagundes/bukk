import React from "react";
import { Icon } from "semantic-ui-react";

const Information = props => {
  return (
    <div
      style={{
        color: "#55acee",
        display: props.show ? "block" : "none",
        marginTop: "10px",
        maxWidth: "400px"
      }}
    >
      <Icon name="info circle" />
      {props.text}
    </div>
  );
};

export default Information;
