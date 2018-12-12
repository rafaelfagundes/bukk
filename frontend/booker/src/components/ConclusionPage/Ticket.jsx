import React, { Component } from "react";
import { Icon, Popup } from "semantic-ui-react";
import "./Ticket.css";

class Ticket extends Component {
  state = {
    open: false
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

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
      <div className="Ticket">
        <div className="ticket-client-details">
          <div className="ticket-client-details-info">
            <div className="ticket-client-details-name">
              {this.props.client.firstName + " " + this.props.client.lastName}
            </div>
            <div className="ticket-client-details-email">
              <Icon name="envelope outline" />
              {this.props.client.email}
            </div>
            <div className="ticket-client-details-phone">
              {this.props.client.whatsapp ? (
                <Icon name="whatsapp" />
              ) : this.props.client.phone.length === 10 ? (
                <Icon name="phone" />
              ) : (
                <Icon name="mobile alternate" />
              )}
              {this.formatBrazilianPhoneNumber(this.props.client.phone)}
            </div>
          </div>
          {/* <div className="ticket-qrcode">
            <img
              className="ticket-qrcode-img"
              src={this.props.qrcode}
              alt="QR CODE"
            />
            <button onClick={this.handleQrCodeSize}>+ Ampliar</button>
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
          </div> */}
        </div>
        <div className="ticket-appointment-details">
          {this.props.services.map(item => (
            <div
              className="ticket-appointment-details-service"
              key={item.serviceKey}
            >
              <div className="ticket-appointment-details-service-avatar">
                <img src={item.specialistImage} alt={item.specialistName} />
              </div>
              <div>
                <div className="ticket-appointment-details-service-desc">
                  {item.serviceDesc}
                </div>
                <div className="ticket-appointment-details-service-specialist">
                  com {item.specialistName}
                </div>
                <div className="ticket-client-details-confirmationId">
                  <Icon name="hashtag" />
                  {item.serviceId}
                  <Popup
                    trigger={
                      <Icon
                        className="help-tooltip"
                        size="mini"
                        name="help"
                        circular
                        color="blue"
                      />
                    }
                    header="Número de agendamento"
                    content="Informe este número de agendamento para a empresa prestadora de serviços, caso eles peçam. Não se preocupe, não é obrigatório e você receberá também por email."
                    basic
                  />
                </div>
                <div className="ticket-appointment-details-service-date">
                  <Icon name="calendar outline" />
                  {item.date}
                </div>
                <div className="ticket-appointment-details-service-time">
                  <Icon name="clock outline" />
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="ticket-company-details">
          <div className="ticket-company-details-name">
            {this.props.companyData.tradingName}
          </div>
          <div className="ticket-company-details-street">
            <Icon name="map marker alternate" />
            {this.props.companyData.address.street},{" "}
            {this.props.companyData.address.number} -{" "}
            {this.props.companyData.address.neighborhood}
          </div>
          <div className="ticket-company-details-city">
            {this.props.companyData.address.city} -{" "}
            {this.props.companyData.address.state}
          </div>
          {this.props.companyData.phone.map(phone => (
            <div className="ticket-company-details-phone" key={phone.number}>
              {phone.phoneType === "landline" ? (
                <Icon name="phone" />
              ) : (
                <Icon name="mobile alternate" />
              )}
              {this.formatBrazilianPhoneNumber(phone.number)}
            </div>
          ))}
          <div className="ticket-company-details-email">
            <Icon name="envelope outline" />
            {this.props.companyData.email}
          </div>
          <div className="ticket-company-details-web">
            <Icon name="world" />
            <a href={this.props.companyData.website}>
              {this.props.companyData.website}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Ticket;
