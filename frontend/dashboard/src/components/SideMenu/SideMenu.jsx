import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import "./SideMenu.css";

class SideMenu extends Component {
  state = { activeItem: "Geral" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

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
        <Menu.Item
          href="/dashboard/"
          name="Geral"
          active={activeItem === "Geral"}
          onClick={this.handleItemClick}
        >
          <Icon name="dashboard" />
          Geral
        </Menu.Item>
        <Menu.Item
          href="/dashboard/relatorios"
          name="Relatórios"
          active={activeItem === "Relatórios"}
          onClick={this.handleItemClick}
        >
          <Icon name="chart line" />
          Relatórios
        </Menu.Item>
        <Menu.Item
          name="Financeiro"
          active={activeItem === "Financeiro"}
          onClick={this.handleItemClick}
        >
          <Icon name="dollar" />
          Financeiro
        </Menu.Item>

        <Menu.Item
          href="/dashboard/clientes"
          name="Clientes"
          active={activeItem === "Clientes"}
          onClick={this.handleItemClick}
        >
          <Icon name="users" />
          Clientes
        </Menu.Item>
        <Menu.Item
          name="messages"
          active={activeItem === "messages"}
          onClick={this.handleItemClick}
        >
          Messages
          <Icon name="chat" />
        </Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = state => {
  return {
    company: state.dashboard.company
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
