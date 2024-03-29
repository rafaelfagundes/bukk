import React from "react";
import { Icon } from "semantic-ui-react";

const ValidationError = props => {
  return (
    <div
      style={{
        color: "red",
        display: props.show ? "block" : "none"
      }}
      className={props.className}
    >
      <Icon name="exclamation circle" />
      {props.error}
    </div>
  );
};

export default ValidationError;
