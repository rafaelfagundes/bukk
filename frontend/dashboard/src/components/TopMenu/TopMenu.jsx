import React, { Component } from "react";
import { Menu, Icon, Image } from "semantic-ui-react";
import UserMenu from "./UserMenu/UserMenu";
import { connect } from "react-redux";
import { NotificationArea } from "./NotificationArea/NotificationArea";
import styled from "styled-components";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const StyledIcon = styled(Icon)`
  color: ${props => props.iconcolor || "#333"};
`;

const StyledTitle = styled.span`
  color: ${props => props.fontcolor || "#333"};
`;

const StyledTopMenu = styled(Menu)`
  box-shadow: 0px 1px 15px 1px rgba(69, 65, 78, 0.1) !important;
  position: fixed;
  width: calc(100% - 190px);
  top: 0px;
  left: 205px;
  z-index: 100;
  background-color: white !important;
  min-height: 80px;
`;

const StyledSubTitle = styled.span`
  color: #666;
  padding-left: 10px;
  font-size: 1rem;
  margin-left: 10px;
`;

const TopMenuTitle = styled.div`
  min-width: 400px;
  line-height: 80px;
  font-size: 1.5rem;
  font-weight: 400;
  padding-left: 38px;
  color: #333;
  > i {
    margin-right: 5px;
  }
`;

const UserMenuTrigger = styled(Image)`
  cursor: pointer;
  min-width: 36px;
  min-height: 36px;
  border-radius: 100%;
`;

const MenuRightSpacer = styled.div`
  width: 25px;
`;

const NotificationTrigger = styled(Menu.Item)`
  cursor: pointer;
`;

const TriggerNumber = styled.div`
  font-weight: 700;
  background-color: #0e6eb8;
  color: #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  line-height: 18px;
  display: inline-block;
  text-align: center;
`;

/* ============================================================================ */

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
      <StyledTopMenu secondary className="TopMenu" id="top-menu">
        {this.props.company && this.props.currentPage && (
          <TopMenuTitle id="top-menu-title" className="top-menu-title">
            <StyledIcon
              name={this.props.currentPage.icon}
              iconcolor={this.props.company.settings.colors.primaryBack}
            />
            <StyledTitle
              fontcolor={this.props.company.settings.colors.primaryBack}
            >
              {this.props.currentPage.title}
            </StyledTitle>
            <StyledSubTitle className="top-menu-subtitle">
              {this.props.currentPage.subtitle}
            </StyledSubTitle>
          </TopMenuTitle>
        )}

        <Menu.Menu position="right">
          {/* <Menu.Item>
            <Input icon="search" placeholder="Procurar..." />
          </Menu.Item> */}
          <NotificationTrigger className="notification-area-trigger">
            <div>
              <Icon name="bell outline" />
              <TriggerNumber>5</TriggerNumber>
            </div>
            <NotificationArea triggerClass="notification-area-trigger" />
          </NotificationTrigger>
          <Menu.Item>
            <UserMenuTrigger
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
          <MenuRightSpacer />
        </Menu.Menu>
      </StyledTopMenu>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.dashboard.user,
    currentPage: state.dashboard.currentPage,
    company: state.dashboard.company
  };
};

export default connect(
  mapStateToProps,
  null
)(TopMenu);
