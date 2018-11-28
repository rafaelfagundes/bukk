import React from "react";
import "./ClientInfo.css";
import { Icon } from "semantic-ui-react";

const ClientInfo = props => (
  <React.Fragment>
    <div className="ClientInfo">
      <div className="client-name">
        {props.name}
      </div>
      <div className="client-email">
        <Icon name="envelope outline" />
        {props.email}
      </div>
      <div className="client-phone">
      {console.log(props.whatsapp)}
        {props.whatsapp ? <Icon name="whatsapp" /> : <Icon name="phone" />}
        {props.phone}
      </div>
      {props.obs !== "" && <div className="client-obs">
        <Icon name="file text outline" />
        {props.obs}
      </div>}
    </div>
  </React.Fragment>
);

export default ClientInfo;
