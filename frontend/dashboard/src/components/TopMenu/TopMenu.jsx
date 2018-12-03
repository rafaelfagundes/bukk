import React, { Component } from "react";
import { Menu, Icon, Dropdown, Image } from "semantic-ui-react";
import "./TopMenu.css";

class TopMenu extends Component {
  state = {};

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    return (
      <Menu secondary className="TopMenu">
        <Menu.Item>
          <Image src="http://acmelogos.com/images/logo-7.svg" />
        </Menu.Item>
        <Menu.Item
          name="home"
          active={activeItem === "home"}
          onClick={this.handleItemClick}
        >
          <Icon name="bars" />
        </Menu.Item>
        {/* <Menu.Item>
          <Input icon="search" placeholder="Procurar..." />
        </Menu.Item> */}

        <Menu.Menu position="right">
          <Menu.Item name="notifications">
            <Dropdown icon="bell outline">
              <Dropdown.Menu id="notifications">
                <Dropdown.Item
                  icon="folder outline"
                  text="Nova pasta de clientes criada"
                />
                <Dropdown.Item
                  icon="calendar plus outline"
                  text="Novo agendamento"
                />
                <Dropdown.Item
                  icon="calendar plus outline"
                  text="Novo agendamento"
                />
                <Dropdown.Item
                  icon="calendar plus outline"
                  text="Novo agendamento"
                />
                <Dropdown.Item icon="user" text="Novo cliente se cadastrou" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
          <Menu.Item>
            <Image
              src="https://colorlib.com//polygon/admindek/files/assets/images/avatar-4.jpg"
              avatar
            />
            <Dropdown text="Rafael Fagundes">
              <Dropdown.Menu id="user-menu">
                <Dropdown.Item icon="user" text="Perfil" />
                <Dropdown.Item icon="wrench" text="Configurações" />
                <Dropdown.Item icon="help" text="Ajuda" />
                <Dropdown.Divider />
                <Dropdown.Item icon="sign-out" text="Sair" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
          <Menu.Item name="expand">
            <Icon name="expand" />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default TopMenu;
