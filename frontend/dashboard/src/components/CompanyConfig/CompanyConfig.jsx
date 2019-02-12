/* eslint no-loop-func: 0 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "semantic-ui-react";
import { setCurrentPage, setCompany } from "../dashboardActions";
import "./CompanyConfig.css";
import General from "./General";
import Settings from "./Settings";
import Services from "./Services";
import Staff from "./Staff";

export class CompanyConfig extends Component {
  state = {
    activeItem: "geral"
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  componentDidMount() {
    if (this.props.company) {
      const _currentPage = {
        title: "Configurações de " + this.props.company.companyNickname,
        icon: "building"
      };
      this.props.setCurrentPage(_currentPage);
    } else {
      const _company = JSON.parse(localStorage.getItem("company"));
      if (_company) {
        const _currentPage = {
          title: "Configurações de " + _company.companyNickname,
          icon: "building"
        };
        this.props.setCurrentPage(_currentPage);
      } else {
        const _currentPage = {
          title: "Configurações da Empresa",
          icon: "building"
        };
        this.props.setCurrentPage(_currentPage);
      }
    }
  }

  render() {
    const { activeItem } = this.state;
    return (
      <>
        {this.props.company !== undefined && (
          <div className="CompanyConfig">
            <div className="div company-config-menu">
              <Menu borderless className="pages-menu">
                <Menu.Item
                  name="geral"
                  active={activeItem === "geral"}
                  onClick={this.handleItemClick}
                  icon="building outline"
                  content="Empresa"
                />
                <Menu.Item
                  name="servicos"
                  active={activeItem === "servicos"}
                  onClick={this.handleItemClick}
                  content="Serviços"
                  icon="wrench"
                />
                <Menu.Item
                  name="funcionarios"
                  active={activeItem === "funcionarios"}
                  onClick={this.handleItemClick}
                  content="Funcionários"
                  icon="users"
                />
                <Menu.Item
                  name="preferencias"
                  active={activeItem === "preferencias"}
                  onClick={this.handleItemClick}
                  content="Preferências"
                  icon="settings"
                />
              </Menu>
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
