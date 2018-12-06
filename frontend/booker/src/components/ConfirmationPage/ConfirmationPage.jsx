import React, { Component } from "react";
import "./ConfirmationPage.css";
import { Header, Icon, Popup } from "semantic-ui-react";
import ServiceListItem from "../ServiceListItem/ServiceListItem";
import PaymentDetails from "../PaymentDetails/PaymentDetails";
import ClientInfo from "../ClientInfo/ClientInfo";
import { setPage } from "../bookerActions";
import { connect } from "react-redux";
import _ from "lodash";

const mapStateToProps = state => {
  return {
    companyData: state.booker.companyData,
    appointment: state.booker.appointment
  };
};

const mapDispatchToProps = dispatch => {
  return { setPage: page => dispatch(setPage(page)) };
};

class ConfirmationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servicesList: [],
      totalPrice: "0.0"
    };
  }

  handleRemoveService = () => {
    this.props.setPage("1");
  };

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
    if (this.props.appointment.services.length > 0) {
      if (this.props.appointment.services[0].serviceId !== "") {
        let _servicesList = [];
        let _totalPrice = 0;

        this.props.appointment.services.forEach(service => {
          let _specialist = this.getSpecialist(service.specialistId);
          let _service = this.getService(service.serviceId);

          _totalPrice += Number(_service.value);

          if (_specialist && _service) {
            _servicesList.push({
              serviceKey: service.serviceKey,
              specialistPhoto: _specialist.image,
              serviceDesc: _service.desc,
              specialistName:
                _specialist.firstName + " " + _specialist.lastName,
              date: service.start
                .locale("pt_BR")
                .format("DD [de] MMMM [de] YYYY"),
              time:
                service.start.format("H:mm A") +
                " até " +
                service.end.format("H:mm A"),
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
  }

  render() {
    return (
      <div className={"ConfirmationPage " + this.props.className}>
        <Header as="h1" id="confirmation-title">
          Confira os detalhes
          <br />
          do seu agendamento
        </Header>
        <Header as="h3" color="blue">
          Seus dados
        </Header>
        <ClientInfo
          name={
            this.props.appointment.client.firstName +
            " " +
            this.props.appointment.client.lastName
          }
          email={this.props.appointment.client.email}
          phone={this.props.appointment.client.phone}
          obs={this.props.appointment.client.obs}
          whatsapp={this.props.appointment.client.whatsapp}
        />
        <Header as="h3" color="blue">
          {this.props.appointment.services.length > 1 ? "Serviços" : "Serviço"}
        </Header>
        {this.state.servicesList.map(item => (
          <ServiceListItem
            service={item}
            key={item.serviceKey}
            serviceKey={item.serviceKey}
          />
        ))}
        <div className="service-remove">
          <Icon name="edit" />
          <button
            onClick={this.handleRemoveService}
            className="service-remove-btn"
          >
            Adicionar ou remover serviços
          </button>
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
            header="Adicionar ou remover serviços"
            content="Ainda dá tempo de adicionar ou remover serviços. Assim que tiver adicionado, volte a essa tela. Nenhum dado será perdido."
            basic
          />
        </div>
        <PaymentDetails
          types={this.props.companyData.business.paymentOptions}
          total={this.state.totalPrice}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmationPage);
