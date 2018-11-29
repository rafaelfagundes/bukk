import React, { Component } from "react";
import "./ServiceListItem.css";
import { Header, Icon, Image } from "semantic-ui-react";

class ServiceListItem extends Component {
  render() {
    return (
      <div className="ServiceListItem">
        <div className="service-photo-container">
          <Image
            className="service-photo-container-photo"
            src={this.props.service.specialistPhoto}
          />
        </div>
        <div className="service-details-container">
          <Header as="h3" id="service-details-container-desc">
            {this.props.service.serviceDesc}
          </Header>
          <Header as="h4" id="service-details-container-name">
            com {this.props.service.specialistName}
          </Header>
          <p>
            <Icon name="calendar outline" />
            {this.props.service.date}
          </p>
          <p>
            <Icon name="clock outline" />
            {this.props.service.time}
          </p>
        </div>
        <div className="service-price">
          <div className="service-price-container">
            <p className="service-price-container-currency">R$</p>
            <p className="service-price-container-price">
              {this.props.service.price.split(".")[0]}
              <span className="service-price-container-price__digits">
                ,
                {this.props.service.price.split(".")[1].length === 1
                  ? this.props.service.price.split(".")[1] + "0"
                  : this.props.service.price.split(".")[1]}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ServiceListItem;
