import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Icon, Button } from "semantic-ui-react";
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
        serviceKey: "18a6673e-4cf5-4b27-878b-da02cgcf9aea",
        serviceId: "service002",
        dateAndTime: { time: "18:00", date: "2018-12-01T18:09:46.000Z" },
        specialistId: "spec002"
      }
    ]
  };

  handlePrint = () => {
    window.print();
  };

  render() {
    return (
      <div className={"ConclusionPage " + this.props.className}>
        {this.props.confirmation.status === "confirmed" && (
          <React.Fragment>
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
            </div>
            <div className="conclusion-content">
              <Ticket
                confirmationId={this.props.confirmation.confirmationId}
                client={this.props.confirmation.client}
                services={this.props.confirmation.services}
                companyData={this.props.companyData}
              />
              <div className="conclusion-footer">
                <p>
                  Todos estes detalhes também
                  <br />
                  serão enviados por email.
                </p>

                <Button
                  labelPosition="left"
                  icon="print"
                  content="Imprimir"
                  onClick={this.handlePrint}
                />
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(ConclusionPage);
