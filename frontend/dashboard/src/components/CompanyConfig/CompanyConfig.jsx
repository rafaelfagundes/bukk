/* eslint no-loop-func: 0 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import { setCurrentPage, setCompany } from "../dashboardActions";
import "./CompanyConfig.css";
import General from "./General";
import Settings from "./Settings";
import Services from "./Services";
import Staff from "./Staff";

export class CompanyConfig extends Component {
  state = {
    activeItem: "funcionarios"
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  componentDidUpdate() {
    const _currentPage = {
      title: "Configurações de " + this.props.company.companyNickname,
      icon: "building"
    };

    if (
      JSON.stringify(this.props.currentPage) !== JSON.stringify(_currentPage)
    ) {
      this.props.setCurrentPage(_currentPage);
    }
  }

  render() {
    return (
      <>
        {this.props.company !== undefined && (
          <div className="CompanyConfig">
            <div className="div company-config-menu">
              <Button.Group className="profile-menu" widths="4" basic>
                <Button
                  name="geral"
                  active={this.state.activeItem === "geral"}
                  onClick={this.handleItemClick}
                >
                  Informações da Empresa
                </Button>
                <Button
                  name="servicos"
                  active={this.state.activeItem === "servicos"}
                  onClick={this.handleItemClick}
                >
                  Serviços
                </Button>
                <Button
                  name="funcionarios"
                  active={this.state.activeItem === "funcionarios"}
                  onClick={this.handleItemClick}
                >
                  Funcionários
                </Button>
                <Button
                  name="preferencias"
                  active={this.state.activeItem === "preferencias"}
                  onClick={this.handleItemClick}
                >
                  Preferências
                </Button>
              </Button.Group>
            </div>
            <div className="company-config-body">
              {this.state.activeItem === "geral" && <General />}
              {this.state.activeItem === "servicos" && <Services />}
              {this.state.activeItem === "funcionarios" && <Staff />}
              {this.state.activeItem === "preferencias" && <Settings />}
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentPage: state.dashboard.currentPage,
    company: state.dashboard.company
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage)),
    setCompany: company => dispatch(setCompany(company))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyConfig);
