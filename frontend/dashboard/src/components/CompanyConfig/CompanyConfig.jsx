/* eslint no-loop-func: 0 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentPage, setCompany } from "../dashboardActions";
import "./CompanyConfig.css";
import General from "./General";
import Settings from "./Settings";
import Services from "./Services";
import Staff from "./Staff";
import ComponentTopMenu from "../Common/ComponentTopMenu";

const menuItems = [
  {
    id: "geral",
    icon: "building outline",
    text: "Empresa"
  },
  {
    id: "servicos",
    icon: "wrench",
    text: "Serviços"
  },
  {
    id: "funcionarios",
    icon: "users",
    text: "Funcionários"
  },
  {
    id: "preferencias",
    icon: "settings",
    text: "Preferências"
  }
];

export class CompanyConfig extends Component {
  state = {
    activeItem: "geral"
  };

  handleItemClick = name => this.setState({ activeItem: name });

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
    return (
      <>
        {this.props.company !== undefined && (
          <div className="CompanyConfig">
            <div className="div company-config-menu">
              <ComponentTopMenu
                items={menuItems}
                onClick={this.handleItemClick}
                activeItem={this.state.activeItem}
                colors={this.props.company.settings.colors}
              />
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
