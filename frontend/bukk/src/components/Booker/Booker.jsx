import React, { Component } from "react";
import { Grid, Image, Button } from "semantic-ui-react";
import "./Booker.css";
import { connect } from "react-redux";
import { setPage, setCompanyData } from "./bookerActions";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import PersonalInfoPage from "./PersonalInfoPage/PersonalInfoPage";
import DateTimePage from "./DateTimePage/DateTimePage";
import ConfirmationPage from "./ConfirmationPage/ConfirmationPage";

const mapStateToProps = state => {
  return {
    page: state.booker.page,
    totalValue: state.booker.totalValue,
    companyData: state.booker.companyData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPage: page => dispatch(setPage(page)),
    setCompanyData: data => dispatch(setCompanyData(data))
  };
};

class Booker extends Component {
  handlePagination = e => {
    this.props.setPage(e.target.value);
  };

  state = {
    pageOneOk: false,
    numPages: 3
  };

  componentDidUpdate(prevProps) {
    console.log(this.props);
    console.log(prevProps);
  }

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
              </div>
              <div className="booker-footer">
                {this.props.page === "1" && (
                  <React.Fragment>
                    <Button
                      primary
                      onClick={this.handlePagination}
                      floated="right"
                      value="2"
                      disabled={!this.state.pageOneOk}
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
                    <Button color="green" floated="right">
                      Confirmar
                    </Button>
                    <Breadcrumbs
                      pages={this.state.numPages}
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
