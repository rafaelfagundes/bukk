import React from "react";
import { Image } from "semantic-ui-react";
import "./Specialist.css";

const Specialist = props => (
  <div
    className={props.random ? "Specialist random" : "Specialist"}
    onClick={e => props.onClick(e, props.value)}
  >
    <Image
      className={
        "specialist-img " + (props.selected ? "specialist-img__selected" : "")
      }
      src={props.image}
      circular
      size="small"
    />
    <div className="specialist-name">
      {props.selected && (
        <>
          <strong>
            {props.firstName}
            <br />
            {props.lastName}
          </strong>
        </>
      )}
      {!props.selected && (
        <>
          {props.firstName}
          <br />
          {props.lastName}
        </>
      )}
    </div>
    <div className="specialist-desc">{props.desc}</div>
  </div>
);

export default Specialist;
