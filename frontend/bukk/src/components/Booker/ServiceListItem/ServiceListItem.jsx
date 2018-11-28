import React from "react";
import "./ServiceListItem.css";
import { Header, Icon, Image } from "semantic-ui-react";

const ServiceListItem = props => (
  <div className="ServiceListItem">
    <div className="service-photo-container">
      <Image
        className="service-photo-container-photo"
        src={props.service.specialistPhoto}
      />
    </div>
    <div className="service-details-container">
      <Header as="h3" id="service-details-container-desc">
        {props.service.serviceDesc}
      </Header>
      <Header as="h4" id="service-details-container-name">
        com {props.service.specialistName}
      </Header>
      <p>
        <Icon name="calendar outline" />
        {props.service.date}
      </p>
      <p>
        <Icon name="clock outline" />
        {props.service.time}
      </p>
    </div>
    <div className="service-price-container">
      <p className="service-price-container-currency">R$</p>
      <p className="service-price-container-price">
        {props.service.price.split(".")[0]}
        <span className="service-price-container-price__digits">
          ,
          {props.service.price.split(".")[1].length === 1
            ? props.service.price.split(".")[1] + "0"
            : props.service.price.split(".")[1]}
        </span>
      </p>
    </div>
  </div>
);

export default ServiceListItem;
