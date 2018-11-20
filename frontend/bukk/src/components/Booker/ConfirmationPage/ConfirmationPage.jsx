import React, { Component } from "react";
import "./ConfirmationPage.css";
import { Header } from "semantic-ui-react";
import ServiceListItem from "../ServiceListItem/ServiceListItem";
import PaymentDetails from "../PaymentDetails/PaymentDetails";

const services = [
  {
    specialistPhoto: "http://i.pravatar.cc/300?img=50",
    specialistName: "Antônio Brasil",
    serviceDesc: "Corte de Cabelo Masculino",
    date: "16 de maio de 2018",
    time: "11:00 AM até 12:00 PM",
    currency: "R$",
    price: "120.99"
  },
  {
    specialistPhoto: "http://i.pravatar.cc/300?img=25",
    specialistName: "Jennifer Honda",
    serviceDesc: "Make",
    date: "19 de novembro de 2018",
    time: "15:00 AM até 17:00 PM",
    currency: "R$",
    price: "319.25"
  },

  {
    specialistPhoto: "http://i.pravatar.cc/300?img=12",
    specialistName: "Carlos Castro Roy",
    serviceDesc: "Barba",
    date: "20 de novembro de 2018",
    time: "9:00 AM até 10:00 PM",
    currency: "R$",
    price: "80.00"
  }
];

class ConfirmationPage extends Component {
  render() {
    return (
      <div className={"ConfirmationPage " + this.props.className}>
        <Header as="h1" id="confirmation-title">
          Confira os detalhes
          <br />
          do seu agendamento
        </Header>
        {services.map(item => (
          <ServiceListItem
            service={item}
            key={Math.floor(Math.random() * 100000 + 1)}
          />
        ))}
        <PaymentDetails />
      </div>
    );
  }
}

export default ConfirmationPage;
