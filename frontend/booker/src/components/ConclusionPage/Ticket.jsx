import React, { Component } from "react";
import { Icon, Segment, Portal } from "semantic-ui-react";
import "./Ticket.css";

class Ticket extends Component {
  state = {
    open: false
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

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
              <Icon name="envelope outline" />
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
            {/* <button onClick={this.handleQrCodeSize}>+ Ampliar</button> */}
            <Portal
              closeOnTriggerClick
              onOpen={this.handleOpen}
              onClose={this.handleClose}
              openOnTriggerClick
              trigger={
                <button
                  negative={this.state.open + ""}
                  positive={!this.state.open + ""}
                >
                  {this.state.open ? "- Fechar" : "+ Ampliar"}
                </button>
              }
            >
              <Segment
                style={{
                  transform: "translate(-209px,-209px)",
                  left: "50%",
                  position: "fixed",
                  top: "50%",
                  zIndex: "1000",
                  boxShadow: "0px 0px 100px rgba(0,0,0,.3)"
                }}
              >
                <img src={this.props.qrcode} alt="QR CODE" />
              </Segment>
            </Portal>
          </div>
        </div>
        <div className="ticket-appointment-details">
          {this.props.services.map(item => (
            <div
              className="ticket-appointment-details-service"
              key={item.serviceKey}
            >
              <div className="ticket-appointment-details-service-avatar">
                <img
                  src={"http://i.pravatar.cc/150?u=" + item.serviceKey}
                  alt="Alguem"
                />
              </div>
              <div>
                <div className="ticket-appointment-details-service-desc">
                  Corte de Cabelo Irado
                </div>
                <div className="ticket-appointment-details-service-specialist">
                  com Tony Tornado
                </div>
                <div className="ticket-appointment-details-service-date">
                  <Icon name="calendar outline" />
                  18 de dezembro de 2018
                </div>
                <div className="ticket-appointment-details-service-time">
                  <Icon name="clock outline" />
                  9:00 AM
                </div>
              </div>
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
            <Icon name="envelope outline" />
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
