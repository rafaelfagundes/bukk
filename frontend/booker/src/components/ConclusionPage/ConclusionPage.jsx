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
