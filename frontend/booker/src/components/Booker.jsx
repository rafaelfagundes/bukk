import React, { Component } from "react";
import { Grid, Image, Button } from "semantic-ui-react";
import "./Booker.css";
import { connect } from "react-redux";
import { setPage, setCompanyData, setConfirmation } from "./bookerActions";

import axios from "axios";
import config from "../config";

import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import PersonalInfoPage from "./PersonalInfoPage/PersonalInfoPage";
import DateTimePage from "./DateTimePage/DateTimePage";
import ConfirmationPage from "./ConfirmationPage/ConfirmationPage";
import ConclusionPage from "./ConclusionPage/ConclusionPage";

const mapStateToProps = state => {
  return {
    page: state.booker.page,
    totalValue: state.booker.totalValue,
    companyData: state.booker.companyData,
    dateAndTimeOk: state.booker.dateAndTimeOk,
    personalInfoOk: state.booker.personalInfoOk,
    confirmationOk: state.booker.confirmationOk,
    appointment: state.booker.appointment
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPage: page => dispatch(setPage(page)),
    setCompanyData: data => dispatch(setCompanyData(data)),
    setConfirmation: confirmation => dispatch(setConfirmation(confirmation))
  };
};

class Booker extends Component {
  componentDidMount() {
    window.addEventListener("beforeunload", this.handleLeavePage);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.handleLeavePage);
  }

  handleLeavePage(e) {
    const confirmationMessage = "Teste";
    e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
    return confirmationMessage; // Gecko, WebKit, Chrome <34
  }

  handlePagination = e => {
    this.props.setPage(e.target.value);
  };

  handleConfirmation = e => {
    var _page = e.target.value;
    axios
      .post(config.api + "/appointment/", this.props.appointment)
      .then(response => {
        this.props.setConfirmation(response.data);
        this.props.setPage(_page);
      })
      .catch(error => {
        console.log(error);
      });
  };

  state = {
    numPages: 3
  };

  render() {
    return (
      <React.Fragment>
        <Grid.Row>
          <Grid.Column>
            <div className="Booker">
              <div className="booker-header">
                <Image
                  src={this.props.companyData.business.logo}
                  className="booker-header-logo"
                />
              </div>
              <div className="booker-main">
                <DateTimePage
                  className={
                    this.props.page === "1" ? "show-page" : "dont-show-page"
                  }
                />
                <PersonalInfoPage
                  className={
                    this.props.page === "2" ? "show-page" : "dont-show-page"
                  }
                />
                <ConfirmationPage
                  className={
                    this.props.page === "3" ? "show-page" : "dont-show-page"
                  }
                />
                <ConclusionPage
                  className={
                    this.props.page === "4" ? "show-page" : "dont-show-page"
                  }
                />
              </div>

              {this.props.page !== "4" && (
                <div className="booker-footer">
                  {this.props.page === "1" && (
                    <React.Fragment>
                      <Button
                        primary
                        onClick={this.handlePagination}
                        floated="right"
                        value="2"
                        disabled={!this.props.dateAndTimeOk}
                      >
                        Continuar
                      </Button>
                      <Breadcrumbs
                        pages={this.state.numPages}
                        currentPage={this.props.page}
                      />
                    </React.Fragment>
                  )}
                  {this.props.page === "2" && (
                    <React.Fragment>
                      <Button
                        floated="left"
                        onClick={this.handlePagination}
                        value="1"
                      >
                        Voltar
                      </Button>
                      <Button
                        primary
                        floated="right"
                        onClick={this.handlePagination}
                        value="3"
                        disabled={!this.props.personalInfoOk}
                      >
                        Continuar
                      </Button>
                      <Breadcrumbs
                        pages={this.state.numPages}
                        currentPage={this.props.page}
                      />
                    </React.Fragment>
                  )}
                  {this.props.page === "3" && (
                    <React.Fragment>
                      <Button
                        floated="left"
                        onClick={this.handlePagination}
                        value="2"
                      >
                        Voltar
                      </Button>
                      <Button
                        color="green"
                        floated="right"
                        disabled={!this.props.confirmationOk}
                        onClick={this.handleConfirmation}
                        value="4"
                      >
                        Confirmar
                      </Button>
                      <Breadcrumbs
                        pages={this.state.numPages}
                        currentPage={this.props.page}
                      />
                    </React.Fragment>
                  )}
                </div>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Booker);
