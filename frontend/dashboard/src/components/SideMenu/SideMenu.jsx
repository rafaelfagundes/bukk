import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./SideMenu.css";

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
    console.log(this.state.activeItem);
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
        {this.props.user && (
          <Menu
            className="SideMenu"
            style={{
              backgroundColor: this.props.company
                ? this.props.company.settings.colors.primaryBack
                : "#888"
            }}
            id="side-menu"
            vertical
            inverted
          >
            <div className="menu-logo">
              <img
                src={this.props.company ? this.props.company.logo : ""}
                alt="Logo"
              />
            </div>
            <Link
              id="dashboard"
              to="/dashboard"
              className={activeItem === "dashboard" ? "active item" : "item"}
              onClick={this.handleItemClick}
            >
              <Icon name="dashboard" />
              Início
            </Link>
            <Link
              to="/dashboard/agendamentos"
              className={activeItem === "agendamentos" ? "active item" : "item"}
              onClick={this.handleItemClick}
              id="agendamentos"
            >
              <Icon name="calendar alternate outline" />
              Agendamentos
            </Link>
            <Link
              to="/dashboard/clientes"
              className={activeItem === "clientes" ? "active item" : "item"}
              onClick={this.handleItemClick}
              id="clientes"
            >
              <Icon name="users" />
              Clientes
            </Link>
            <Link
              to="/dashboard/relatorios"
              className={activeItem === "relatorios" ? "active item" : "item"}
              onClick={this.handleItemClick}
              id="relatorios"
            >
              <Icon name="chart line" />
              Relatórios
            </Link>
            <Link
              to="/dashboard/financeiro"
              className={activeItem === "financeiro" ? "active item" : "item"}
              onClick={this.handleItemClick}
              id="financeiro"
            >
              <Icon name="dollar" />
              Financeiro
            </Link>
            <Link
              to="/dashboard/perfil"
              className={activeItem === "perfil" ? "active item" : "item"}
              onClick={this.handleItemClick}
              id="perfil"
            >
              <Icon name="settings" />
              Preferências
            </Link>
            {this.props.user.role === "owner" && (
              <>
                <Link
                  to="/dashboard/configuracoes-empresa"
                  className={activeItem === "empresa" ? "active item" : "item"}
                  onClick={this.handleItemClick}
                  id="empresa"
                >
                  <Icon name="building" />
                  Config. da Empresa
                </Link>
              </>
            )}
          </Menu>
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
