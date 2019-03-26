import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentPage, setCompany } from "../dashboardActions";
import General from "./General";
import Settings from "./Settings";
import ComponentTopMenu from "../Common/ComponentTopMenu";
import styled from "styled-components";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */
const StyledCompanyConfig = styled.div`
  padding-bottom: 50px;
`;

/* ============================================================================ */

const menuItems = [
  {
    id: "geral",
    icon: "building outline",
    text: "Empresa"
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
          <StyledCompanyConfig>
            <ComponentTopMenu
              items={menuItems}
              onClick={this.handleItemClick}
              activeItem={this.state.activeItem}
              colors={this.props.company.settings.colors}
            />

            <React.Fragment>
              {this.state.activeItem === "geral" && <General />}
              {this.state.activeItem === "preferencias" && <Settings />}
            </React.Fragment>
          </StyledCompanyConfig>
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
