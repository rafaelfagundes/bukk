import React, { Component } from "react";
import { Grid, Image, Button } from "semantic-ui-react";
import "./Booker.css";
import { connect } from "react-redux";
import { setPage, setCompanyData, setConfirmation } from "./bookerActions";

import axios from "axios";
import moment from "moment";
import _ from "lodash";

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
        const _response = response.data;

        _response.services.forEach(service => {
          const _service = this.getService(service.serviceId);
          const _specialist = this.getSpecialist(service.specialistId);
          service.specialistName =
            _specialist.firstName + " " + _specialist.lastName;
          service.specialistImage = _specialist.image;
          service.specialistTitle = _specialist.desc;
          service.serviceDesc = _service.desc;
          service.time =
            moment(service.start).format("H:mm A") +
            " até " +
            moment(service.end).format("H:mm A");
          service.date = moment(service.start)
            .locale("pt_BR")
            .format("DD [de] MMMM [de] YYYY");
        });

        this.props.setConfirmation(_response);
        this.props.setPage(_page);
      })
      .catch(error => {
        console.log(error);
      });
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

  state = {
    numPages: 3
  };

  render() {
    return (
      <React.Fragment>
        <Grid.Row>
          <Grid.Column>
            {this.props.match.params.companyId && (
              <div className="Booker">
                <div className="booker-header">
                  <Image
                    src={this.props.companyData.business.logo}
                    className="booker-header-logo"
                  />
                </div>
                <div className="booker-main">
                  <DateTimePage
                    companyId={this.props.match.params.companyId}
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
            )}
          </Grid.Column>
        </Grid.Row>
        <Button floated="left" onClick={this.handlePagination} value="3">
          voltar
        </Button>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Booker);
