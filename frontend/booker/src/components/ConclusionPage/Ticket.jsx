import React, { Component } from "react";
import { Icon, Popup } from "semantic-ui-react";
import "./Ticket.css";
import { formatBrazilianPhoneNumber } from "../Utils/utils";

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
              {formatBrazilianPhoneNumber(this.props.client.phone)}
            </div>
          </div>
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
            <Icon name="map outline" />
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
              {formatBrazilianPhoneNumber(phone.number)}
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
