import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Icon } from "semantic-ui-react";
import Ticket from "./Ticket";

import "./ConclusionPage.css";

const mapStateToProps = state => {
  return {
    page: state.booker.page,
    confirmation: state.booker.confirmation,
    companyData: state.booker.companyData
  };
};

class ConclusionPage extends Component {
  state = {
    status: "confirmed",
    msg: "Agendamento concluído com sucesso",
    confirmationId: "6c22b5fdc8c24913ac4d9b63",
    client: {
      firstName: "Richard",
      lastName: "Mula",
      email: "mula@gmail.com",
      phone: "32991267913",
      whatsapp: true,
      obs:
        "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
    },
    services: [
      {
        serviceKey: "18a6673e-4cf5-4b27-878b-da02cfcf9aea",
        serviceId: "service001",
        dateAndTime: { time: "16:00", date: "2018-11-30T18:09:46.000Z" },
        specialistId: "spec001"
      },
      {
        serviceKey: "18a6673e-4cf5-4b27-878b-da02cfcf9aea",
        serviceId: "service002",
        dateAndTime: { time: "18:00", date: "2018-12-01T18:09:46.000Z" },
        specialistId: "spec002"
      }
    ]
  };

  componentDidMount() {}

  render() {
    return (
      <div className={"ConclusionPage " + this.props.className}>
        {this.state.status === "confirmed" && (
          <div className="conclusion-header">
            <Icon
              className="conclusion-icon"
              name="check circle outline"
              size="huge"
              color="green"
            />
            <Header as="h1" className="conclusion-title">
              Agendamento concluído
              <br />
              com sucesso
            </Header>

            <Ticket
              confirmationId={this.state.confirmationId}
              name={
                this.state.client.firstName + " " + this.state.client.lastName
              }
              email={this.state.client.email}
              phone={this.state.client.phone}
              whatsapp={this.state.client.whatsapp}
              qrcode={this.props.confirmation.qrcode}
              services={this.state.services}
            />

            {/* <img
              src={this.props.confirmation.qrcode}
              alt="Escaneie o QR Code com seu smartphone para salvar na agenda."
              title="Escaneie o QR Code com seu smartphone para salvar na agenda."
              width={this.state.qrcode.width}
              height={this.state.qrcode.height}
            /> */}
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(ConclusionPage);
