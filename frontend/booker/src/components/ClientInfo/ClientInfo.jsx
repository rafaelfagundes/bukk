import React, { Component } from "react";
import "./ClientInfo.css";
import { Icon } from "semantic-ui-react";
import { formatBrazilianPhoneNumber } from "../Utils/utils";

class ClientInfo extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="ClientInfo">
          <div className="client-name">{this.props.name}</div>
          <div className="client-email">
            <Icon name="envelope outline" />
            {this.props.email}
          </div>
          <div className="client-phone">
            {this.props.whatsapp ? (
              <Icon name="whatsapp" />
            ) : this.props.phone.length === 10 ? (
              <Icon name="phone" />
            ) : (
              <Icon name="mobile alternate" />
            )}
            {formatBrazilianPhoneNumber(this.props.phone)}
          </div>
          {this.props.obs !== "" && (
            <div className="client-obs">
              <Icon name="file text outline" />
              {this.props.obs}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default ClientInfo;
