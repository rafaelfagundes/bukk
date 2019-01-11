import React, { Component } from "react";
import { Menu, Icon, Dropdown, Image } from "semantic-ui-react";
import "./TopMenu.css";
import UserMenu from "./UserMenu/UserMenu";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    user: state.dashboard.user,
    currentPage: state.dashboard.currentPage
  };
};

class TopMenu extends Component {
  state = {
    fullscreen: false,
    fullscreenIcon: "expand",
    showUserMenu: false
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  toggleUserMenu = e => {
    this.setState({ showUserMenu: !this.state.showUserMenu }, () => {});
  };

  toggleFullScreen = () => {
    const docElm = document.getElementById("root");
    if (this.state.fullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.setState({ fullscreen: false, fullscreenIcon: "expand" });
    } else {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
      this.setState({ fullscreen: true, fullscreenIcon: "compress" });
    }
  };

  render() {
    return (
      <Menu secondary className="TopMenu" id="top-menu">
        <div id="top-menu-title" className="top-menu-title">
          <Icon name={this.props.currentPage.icon} />
          {this.props.currentPage.title}
        </div>

        <Menu.Menu position="right">
          {/* <Menu.Item>
            <Input icon="search" placeholder="Procurar..." />
          </Menu.Item> */}
          <Menu.Item name="notifications">
            {/* <Dropdown icon="bell outline" text="12" iconPosition="right"> */}

            {/* icon bell outline when new notification and new-notification class */}
            <Dropdown
              text="12"
              icon="bell"
              floating
              labeled
              button
              className="icon new-notification"
            >
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
            {/* <div className="top-menu-notification-number">12</div> */}
          </Menu.Item>
          <Menu.Item>
            <Image
              src={this.props.user.avatar}
              avatar
              size="mini"
              onClick={this.toggleUserMenu}
              className="user-menu-trigger"
            />
            <UserMenu triggerClass="user-menu-trigger" />
          </Menu.Item>
          <Menu.Item name="expand" onClick={this.toggleFullScreen}>
            <Icon name={this.state.fullscreenIcon} />
          </Menu.Item>
          <div id="menu-right-spacer" />
        </Menu.Menu>
      </Menu>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(TopMenu);
