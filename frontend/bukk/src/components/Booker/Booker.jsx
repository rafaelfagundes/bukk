import React, { Component } from "react";
import { Grid, Header, Image, Button } from "semantic-ui-react";
import "./Booker.css";
import { connect } from "react-redux";
import { setPage } from "./bookerActions";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";

const mapStateToProps = state => {
  return {
    page: state.booker.page,
    numPages: state.booker.numPages,
    totalValue: state.booker.totalValue
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPage: page => dispatch(setPage(page))
  };
};

class Booker extends Component {
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
                {this.props.page === "1" && <Header as="h1">1</Header>}
                {this.props.page === "2" && <Header as="h1">2</Header>}
                {this.props.page === "3" && <Header as="h1">3</Header>}
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
                    <Button color="green" size="large" floated="right">
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
