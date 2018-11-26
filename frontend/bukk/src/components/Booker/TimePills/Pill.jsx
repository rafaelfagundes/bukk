import React from "react";

const Pill = props => {
  return (
    <div
      className={"ui medium label" + (props.item.selected ? " blue" : "")}
      onClick={props.onClick}
    >
      {props.item.time}
    </div>
  );
};

export default Pill;
