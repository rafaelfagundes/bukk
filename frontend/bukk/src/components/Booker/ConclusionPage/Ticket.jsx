import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import "./Ticket.css";

class Ticket extends Component {
  state = {
    qrcode: {
      width: 80,
      height: 80,
      amplified: false
    }
  };

  handleQrCodeSize = e => {
    console.log("ok");
    if (this.state.qrcode.amplified) {
      this.setState({
        qrcode: { height: 80, width: 80, amplified: false }
      });
    } else {
      this.setState({ qrcode: { height: 388, width: 388, amplified: true } });
    }
  };

  render() {
    return (
      <div className="Ticket">
        <div className="ticket-client-details">
          <div className="ticket-client-details-info">
            <div className="ticket-client-details-confirmationId">
              #{this.props.confirmationId}
            </div>
            <div className="ticket-client-details-name">{this.props.name}</div>
            <div className="ticket-client-details-email">
              <Icon name="mail outline" />
              {this.props.email}
            </div>
            <div className="ticket-client-details-phone">
              {this.props.whatsapp ? (
                <Icon name="whatsapp" />
              ) : this.props.phone.length === 10 ? (
                <Icon name="phone" />
              ) : (
                <Icon name="mobile alternate" />
              )}
              {this.props.phone}
            </div>
          </div>
          <div className="ticket-qrcode">
            <img
              className="ticket-qrcode-img"
              src={this.props.qrcode}
              alt="QR CODE"
            />
            <button onClick={this.handleQrCodeSize}>+ Ampliar</button>
          </div>
        </div>
        <div className="ticket-appointment-details">
          {this.props.services.map(item => (
            <div className="ticket-appointment-details-service">
              <div className="ticket-appointment-details-service-avatar" />
              <div className="ticket-appointment-details-service-desc" />
              <div className="ticket-appointment-details-service-specialist" />
              <div className="ticket-appointment-details-service-date" />
              <div className="ticket-appointment-details-service-time" />
            </div>
          ))}
        </div>
        <div className="ticket-company-details">
          <div className="ticket-company-details-name">Acme Co.</div>
          <div className="ticket-company-details-street">
            <Icon name="map marker alternate" />
            Rua Frederico Ozanan, 150 - Guarda-Mor
          </div>
          <div className="ticket-company-details-city">
            São João del Rei - MG
          </div>
          <div className="ticket-company-details-phone">
            <Icon name="phone" />
            (32) 3371-1234
          </div>
          <div className="ticket-company-details-email">
            <Icon name="mail outline" />
            contato@rafaelf.com.br
          </div>
          <div className="ticket-company-details-web">
            <Icon name="world" />
            <a href="www.rafaelf.com.br">www.rafaelf.com.br</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Ticket;
