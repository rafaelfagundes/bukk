import React from "react";
import { Image, Header } from "semantic-ui-react";
import "./Specialist.css";

const Specialist = props => (
  <div className="Specialist" onClick={e => props.onClick(e, props.value)}>
    <Image
      className={
        "specialist-img " + (props.selected ? "specialist-img__selected" : "")
      }
      src={props.image}
      circular
      size="small"
    />
    <Header className="specialist-name" as="h4">
      {props.firstName}
      <br />
      {props.lastName}
    </Header>
    <Header className="specialist-desc" sub>
      {props.desc}
    </Header>
  </div>
);

export default Specialist;
