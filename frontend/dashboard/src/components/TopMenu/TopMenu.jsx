import React, { Component } from "react";
import { Menu, Icon, Image } from "semantic-ui-react";
import "./TopMenu.css";
import UserMenu from "./UserMenu/UserMenu";
import { connect } from "react-redux";
import { NotificationArea } from "./NotificationArea/NotificationArea";

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
          <Icon
            name={
              this.props.currentPage === undefined
                ? "home"
                : this.props.currentPage.icon
            }
          />
          {this.props.currentPage === undefined
            ? ""
            : this.props.currentPage.title}
          <span className="top-menu-subtitle">
            {this.props.currentPage === undefined
              ? ""
              : this.props.currentPage.subtitle}
          </span>
        </div>

        <Menu.Menu position="right">
          {/* <Menu.Item>
            <Input icon="search" placeholder="Procurar..." />
          </Menu.Item> */}
          <Menu.Item className="notification-area-trigger">
            <div>
              <Icon name="bell outline" />
              <span>4</span>
            </div>
            <NotificationArea triggerClass="notification-area-trigger" />
          </Menu.Item>
          <Menu.Item>
            <Image
              src={this.props.user === undefined ? "" : this.props.user.avatar}
              avatar
              rounded
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
