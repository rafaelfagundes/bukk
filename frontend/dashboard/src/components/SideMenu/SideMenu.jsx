import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledSideMenu = styled(Menu)`
  text-align: left;
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 200px !important;
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.3) !important;
  z-index: 99;
  border-radius: 0px !important;
  box-sizing: border-box !important;
  background-color: ${props => props.companycolors.primaryBack} !important;
  > a {
    line-height: 22px !important;
  }
`;

const Logo = styled.div`
  padding-top: 22px;
  padding-bottom: 22px;
  min-height: 83px;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    max-width: calc(100% - 30px);
  }
`;

const StyledLink = styled(Link)`
  > i.icon {
    float: left !important;
    margin: 0 0.5em 0 0 !important;
  }
`;

class SideMenu extends Component {
  state = { activeItem: "dashboard", role: undefined, path: undefined };

  handleItemClick = e => {
    this.setState({ activeItem: e.currentTarget.id });
  };

  componentDidUpdate() {
    if (window.location.pathname !== this.state.path) {
      this.updateMenu();
    }
  }

  componentDidMount() {
    this.updateMenu();
  }

  updateMenu() {
    const _path = window.location.pathname;
    let _role = undefined;
    if (localStorage.getItem("employee")) {
      _role = "employee";
    } else {
      _role = "owner";
    }
    function is(path, value) {
      return path.indexOf(value) >= 0;
    }
    if (is(_path, "dashboard")) {
      this.setState({ activeItem: "dashboard", role: _role, path: _path });
    }
    if (is(_path, "agendamentos")) {
      this.setState({ activeItem: "agendamentos", role: _role, path: _path });
    }
    if (is(_path, "relatorios")) {
      this.setState({ activeItem: "relatorios", role: _role, path: _path });
    }
    if (is(_path, "perfil")) {
      this.setState({ activeItem: "perfil", role: _role, path: _path });
    }
    if (is(_path, "clientes")) {
      this.setState({ activeItem: "clientes", role: _role, path: _path });
    }
    if (is(_path, "financeiro")) {
      this.setState({ activeItem: "financeiro", role: _role, path: _path });
    }
    if (is(_path, "configuracoes-empresa")) {
      this.setState({ activeItem: "empresa", role: _role, path: _path });
    }
  }

  render() {
    const { activeItem } = this.state;
    return (
      <>
        {this.props.user && this.props.company && (
          <StyledSideMenu
            vertical
            inverted
            companycolors={this.props.company.settings.colors}
          >
            <Logo className="menu-logo">
              <img
                src={this.props.company ? this.props.company.logo : ""}
                alt="Logo"
              />
            </Logo>
            <StyledLink
              id="dashboard"
              to="/dashboard"
              className={activeItem === "dashboard" ? "active item" : "item"}
              onClick={this.handleItemClick}
            >
              <Icon name="dashboard" />
              Início
            </StyledLink>
            <StyledLink
              to="/dashboard/agendamentos"
              className={activeItem === "agendamentos" ? "active item" : "item"}
              onClick={this.handleItemClick}
              id="agendamentos"
            >
              <Icon name="calendar alternate outline" />
              Agendamentos
            </StyledLink>
            <StyledLink
              to="/dashboard/clientes"
              className={activeItem === "clientes" ? "active item" : "item"}
              onClick={this.handleItemClick}
              id="clientes"
            >
              <Icon name="users" />
              Clientes
            </StyledLink>
            <StyledLink
              to="/dashboard/relatorios"
              className={activeItem === "relatorios" ? "active item" : "item"}
              onClick={this.handleItemClick}
              id="relatorios"
            >
              <Icon name="chart line" />
              Relatórios
            </StyledLink>
            <StyledLink
              to="/dashboard/financeiro"
              className={activeItem === "financeiro" ? "active item" : "item"}
              onClick={this.handleItemClick}
              id="financeiro"
            >
              <Icon name="dollar" />
              Financeiro
            </StyledLink>
            <StyledLink
              to="/dashboard/perfil"
              className={activeItem === "perfil" ? "active item" : "item"}
              onClick={this.handleItemClick}
              id="perfil"
            >
              <Icon name="settings" />
              Preferências
            </StyledLink>
            {this.props.user.role === "owner" && (
              <>
                <StyledLink
                  to="/dashboard/configuracoes-empresa"
                  className={activeItem === "empresa" ? "active item" : "item"}
                  onClick={this.handleItemClick}
                  id="empresa"
                >
                  <Icon name="building" />
                  Config. da Empresa
                </StyledLink>
              </>
            )}
          </StyledSideMenu>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    company: state.dashboard.company,
    currentPage: state.dashboard.currentPage,
    user: state.dashboard.user
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
