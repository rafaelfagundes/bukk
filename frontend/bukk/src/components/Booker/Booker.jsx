import React, { Component } from "react";
import { Grid, Header, Image, Button } from "semantic-ui-react";
import "./Booker.css";
import { connect } from "react-redux";
import { setPage } from "./bookerActions";

const mapStateToProps = state => {
  return {
    page: state.booker.page,
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
                <div className="booker-header-label">
                  R$ {this.props.totalValue}
                </div>
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
                    <div className="booker-footer-page-numbers">
                      <span className="booker-footer-page-number booker-footer-page-number__active">
                        1
                      </span>
                      <span className="booker-footer-page-number">2</span>
                      <span className="booker-footer-page-number">3</span>
                    </div>
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
                    <div className="booker-footer-page-numbers">
                      <span className="booker-footer-page-number">1</span>
                      <span className="booker-footer-page-number booker-footer-page-number__active">
                        2
                      </span>
                      <span className="booker-footer-page-number">3</span>
                    </div>
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
                    <div className="booker-footer-page-numbers">
                      <span className="booker-footer-page-number">1</span>
                      <span className="booker-footer-page-number">2</span>
                      <span className="booker-footer-page-number booker-footer-page-number__active">
                        3
                      </span>
                    </div>
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
