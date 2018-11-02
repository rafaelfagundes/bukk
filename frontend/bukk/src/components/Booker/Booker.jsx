import React, { Component } from "react";
import { Grid, Image, Button } from "semantic-ui-react";
import "./Booker.css";
import { connect } from "react-redux";
import { setPage, setTimeTable } from "./bookerActions";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import PersonalInfoPage from "./PersonalInfoPage/PersonalInfoPage";
import DateTimePage from "./DateTimePage/DateTimePage";
import ConfirmationPage from "./ConfirmationPage/ConfirmationPage";

const mapStateToProps = state => {
  return {
    page: state.booker.page,
    numPages: state.booker.numPages,
    totalValue: state.booker.totalValue,
    excludeTimes: state.booker.excludeTimes,
    startTime: state.booker.startTime,
    endTime: state.booker.endTime,
    minTimeFrame: state.booker.minTimeFrame
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPage: page => dispatch(setPage(page)),
    setTimeTable: timeTable => dispatch(setTimeTable(timeTable))
  };
};

class Booker extends Component {
  populateTimeTable() {
    var localTimeTable = [],
      i,
      j;
    for (
      i = Number(this.props.startTime);
      i < Number(this.props.endTime);
      i++
    ) {
      for (j = 0; j < 60 / Number(this.props.minTimeFrame); j++) {
        localTimeTable.push(
          i + ":" + (j === 0 ? "00" : Number(this.props.minTimeFrame) * j)
        );
      }
    }

    for (let index = 0; index < this.props.excludeTimes.length; index++) {
      const element = this.props.excludeTimes[index];
      localTimeTable.splice(localTimeTable.indexOf(element), 1);
    }

    this.props.setTimeTable(localTimeTable);
  }

  componentWillMount() {
    this.populateTimeTable();
  }

  handlePagination = e => {
    this.props.setPage(e.target.value);
  };

  render() {
    return (
      <React.Fragment>
        <Grid.Row>
          <Grid.Column>
            <div className="Booker">
              <div className="booker-header">
                <Image
                  src={require("./img/logo.png")}
                  className="booker-header-logo"
                />
                {this.props.page !== "3" && (
                  <div className="booker-header-label">
                    R$ {this.props.totalValue}
                  </div>
                )}
              </div>
              <div className="booker-main">
                {this.props.page === "1" && <DateTimePage />}
                {this.props.page === "2" && <PersonalInfoPage />}
                {this.props.page === "3" && <ConfirmationPage />}
              </div>
              <div className="booker-footer">
                {this.props.page === "1" && (
                  <React.Fragment>
                    <Button
                      primary
                      onClick={this.handlePagination}
                      floated="right"
                      value="2"
                    >
                      Próximo
                    </Button>
                    <Breadcrumbs
                      pages={this.props.numPages}
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
                    >
                      Próximo
                    </Button>
                    <Breadcrumbs
                      pages={this.props.numPages}
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
                    <Button color="green" floated="right">
                      Confirmar
                    </Button>
                    <Breadcrumbs
                      pages={this.props.numPages}
                      currentPage={this.props.page}
                    />
                  </React.Fragment>
                )}
              </div>
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
