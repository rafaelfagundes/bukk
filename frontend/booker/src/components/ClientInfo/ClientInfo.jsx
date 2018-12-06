import React, { Component } from "react";
import "./ClientInfo.css";
import { Icon } from "semantic-ui-react";

class ClientInfo extends Component {
  formatBrazilianPhoneNumber(phone) {
    if (phone.length === 11) {
      let _number = `(${phone[0]}${phone[1]}) ${phone[2]}${phone[3]}${
        phone[4]
      }${phone[5]}${phone[6]}-${phone[7]}${phone[8]}${phone[9]}${phone[10]}`;

      return _number;
    } else if (phone.length === 10) {
      let _number = `(${phone[0]}${phone[1]}) ${phone[2]}${phone[3]}${
        phone[4]
      }${phone[5]}-${phone[6]}${phone[7]}${phone[8]}${phone[9]}`;

      return _number;
    } else {
      return phone;
    }
  }

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
            {this.formatBrazilianPhoneNumber(this.props.phone)}
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
