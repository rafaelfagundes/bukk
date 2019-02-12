import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./SideMenu.css";

class SideMenu extends Component {
  state = { activeItem: "dashboard" };

  handleItemClick = e => {
    this.setState({ activeItem: e.currentTarget.id });
  };

  componentDidMount() {
    const _path = window.location.pathname;
    function is(path, value) {
      return path.indexOf(value) >= 0;
    }

    if (is(_path, "dashboard")) {
      this.setState({ activeItem: "dashboard" });
    }
    if (is(_path, "agendamentos")) {
      this.setState({ activeItem: "agendamentos" });
    }
    if (is(_path, "relatorios")) {
      this.setState({ activeItem: "relatorios" });
    }
    if (is(_path, "perfil")) {
      this.setState({ activeItem: "perfil" });
    }
    if (is(_path, "clientes")) {
      this.setState({ activeItem: "clientes" });
    }
    if (is(_path, "financeiro")) {
      this.setState({ activeItem: "financeiro" });
    }
  }

  render() {
    const { activeItem } = this.state;
    return (
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
      </Menu>
    );
  }
}

const mapStateToProps = state => {
  return {
    company: state.dashboard.company,
    currentPage: state.dashboard.currentPage
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
