import React, { Component } from "react";
import { Menu, Icon, Input } from "semantic-ui-react";
import "./SideMenu.css";

class SideMenu extends Component {
  state = {};

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    return (
      <Menu className="SideMenu" id="side-menu" vertical inverted>
        <Menu.Item>
          <Input iconPosition="left" icon="search" placeholder="Procurar..." />
        </Menu.Item>
        <Menu.Item
          href="/"
          name="Geral"
          active={activeItem === "Geral"}
          onClick={this.handleItemClick}
        >
          <Icon name="dashboard" />
          Geral
        </Menu.Item>
        <Menu.Item
          href="/relatorios"
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
          href="/clientes"
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

        {/* <Dropdown item text="Outros">
          <Dropdown.Menu>
            <Dropdown.Item icon="edit" text="Edit Profile" />
            <Dropdown.Item icon="globe" text="Choose Language" />
            <Dropdown.Item icon="settings" text="Account Settings" />
          </Dropdown.Menu>
        </Dropdown> */}
      </Menu>
    );
  }
}

export default SideMenu;
