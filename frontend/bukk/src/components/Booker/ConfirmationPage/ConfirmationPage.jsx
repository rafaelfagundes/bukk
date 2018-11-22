import React, { Component } from "react";
import "./ConfirmationPage.css";
import { Header } from "semantic-ui-react";
import ServiceListItem from "../ServiceListItem/ServiceListItem";
import PaymentDetails from "../PaymentDetails/PaymentDetails";
import { connect } from "react-redux";
import _ from "lodash";

const mapStateToProps = state => {
  return {
    companyData: state.booker.companyData,
    appointment: state.booker.appointment
  };
};

class ConfirmationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servicesList: [],
      totalPrice: "0.0"
    };
  }

  getSpecialist(id) {
    const index = _.findIndex(this.props.companyData.specialists, function(o) {
      return o.id === id;
    });
    if (index >= 0) {
      return this.props.companyData.specialists[index];
    } else {
      return null;
    }
  }
  getService(id) {
    const index = _.findIndex(this.props.companyData.services, function(o) {
      return o.id === id;
    });
    if (index >= 0) {
      return this.props.companyData.services[index];
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.appointment.services[0].serviceId !== "") {
      let _servicesList = [];
      let _totalPrice = 0;

      this.props.appointment.services.forEach(service => {
        let _specialist = this.getSpecialist(service.specialistId);
        let _service = this.getService(service.serviceId);

        _totalPrice += _service.value;

        if (_specialist && _service) {
          _servicesList.push({
            specialistPhoto: _specialist.image,
            serviceDesc: _service.desc,
            specialistName: _specialist.firstName + " " + _specialist.lastName,
            date: service.dateAndTime.date
              .locale("pt_BR")
              .format("DD [de] MMMM [de] YYYY"),
            time:
              service.dateAndTime.time.length === 4
                ? service.dateAndTime.time + " AM"
                : service.dateAndTime.time,
            price: "" + _service.value
          });
        }
      });

      if (
        _servicesList.length > 0 &&
        !_.isEqual(this.state.servicesList, _servicesList)
      ) {
        this.setState({
          servicesList: _servicesList,
          totalPrice: "" + _totalPrice
        });
      }
    }
  }

  render() {
    return (
      <div className={"ConfirmationPage " + this.props.className}>
        <Header as="h1" id="confirmation-title">
          Confira os detalhes
          <br />
          do seu agendamento
        </Header>
        {this.state.servicesList.map(item => (
          <ServiceListItem
            service={item}
            key={item.serviceDesc + item.date + item.time + item.price}
          />
        ))}
        <PaymentDetails total={this.state.totalPrice} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(ConfirmationPage);
