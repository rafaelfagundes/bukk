import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import styled from "styled-components";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const StyledUserMenu = styled.div`
  top: 100%;
  right: 0;
  text-align: left;
  position: absolute;
  z-index: 101;
  padding-top: 0;
  min-width: 300px;
  transform: translateZ(0);
  backface-visibility: hidden;
  border-radius: 4px;
`;

const UserMenuInner = styled.div`
  background-color: #fff;
  box-shadow: 0px 5px 15px 1px rgba(69, 65, 78, 0.2);
  border-radius: 4px;
`;

const UserMenuHeader = styled.div`
  padding: 20px 20px;
  box-shadow: 1px 34px 52px -19px rgba(68, 62, 84, 0.03);
`;

const UserMenuHeaderDetails = styled.div`
  display: table-cell;
  width: 100%;
  text-align: left;
  vertical-align: middle;
  padding: 0 0 0 15px;
`;

const UserMenuCard = styled.div`
  padding: 5px 0;
  margin: 0;
  display: table;
  table-layout: fixed;
`;

const UserMenuAvatar = styled.img`
  width: 72px;
  min-height: 72px;
  border-radius: 50%;
`;

const UserMenuHeaderDetailsName = styled.span`
  display: block;
  padding: 0 0 0 0;
  font-size: 1.4rem;
  font-weight: 400;
  color: #1b1c1e;
  line-height: 25px;
`;

const UserMenuHeaderDetailsEmail = styled.span`
  display: inline-block;
  padding: 0 0 0 0;
  font-size: 1rem;
  color: #3f4047;
  line-height: 20px;
`;

const UserMenuBody = styled.div`
  padding: 20px;

  > ul {
    padding: 0;
    margin: 0;
  }
  > ul li {
    display: table;
    table-layout: fixed;
    width: 100%;
    height: 100%;
    text-decoration: none;
    position: relative;
    outline: none !important;
    vertical-align: middle;
    padding: 9px 0;
  }
  > ul li i {
    opacity: 0.65;
  }
`;

/* ============================================================================ */

export class UserMenu extends Component {
  state = {
    visible: false,
    clickedOutside: true
  };

  componentDidMount() {
    document.addEventListener("click", this.handleClick, true);
  }

  componentWillMount() {
    document.removeEventListener("click", this.handleClick, true);
  }

  handleClick = event => {
    if (typeof event.target.className !== "string") {
      return false;
    } else {
      const domNode = ReactDOM.findDOMNode(this);

      if (event.target.className.indexOf(this.props.triggerClass) >= 0) {
        if (this.state.visible) {
          this.setState({
            clickedOutside: false,
            visible: false
          });
        } else {
          this.setState({
            clickedOutside: false,
            visible: true
          });
        }
        return false;
      }

      if (!domNode || !domNode.contains(event.target)) {
        this.setState({
          clickedOutside: true,
          visible: false
        });
      }
    }
  };
  handleClickOnLink = () => {
    this.setState({ visible: false });
  };
  render() {
    return (
      <>
        {this.state.visible && (
          <StyledUserMenu>
            <UserMenuInner>
              <UserMenuHeader>
                <UserMenuCard>
                  <div>
                    <UserMenuAvatar
                      src={this.props.user.avatar}
                      className=""
                      alt=""
                    />
                  </div>
                  <UserMenuHeaderDetails>
                    <UserMenuHeaderDetailsName className="user-menu-header-user-card-details-name">
                      {this.props.user.firstName +
                        " " +
                        this.props.user.lastName}
                    </UserMenuHeaderDetailsName>
                    <UserMenuHeaderDetailsEmail className="user-menu-header-user-card-details-email">
                      {this.props.user.email}
                    </UserMenuHeaderDetailsEmail>
                  </UserMenuHeaderDetails>
                </UserMenuCard>
              </UserMenuHeader>

              <UserMenuBody>
                <ul>
                  <li>
                    <Icon name="user" />
                    <Link
                      onClick={this.handleClickOnLink}
                      to="/dashboard/perfil"
                    >
                      Meu perfil
                    </Link>
                  </li>
                  {this.props.user.role === "owner" && (
                    <li>
                      <Icon name="setting" />
                      <Link
                        onClick={this.handleClickOnLink}
                        to="/dashboard/configuracoes-empresa"
                      >
                        Configurações da empresa
                      </Link>
                    </li>
                  )}
                  <li>
                    <Icon name="help" />
                    <a href="/dashboard/help">Ajuda</a>
                  </li>
                  <li />
                  <li>
                    <Icon name="log out" />
                    <a href="/dashboard/logout">Sair</a>
                  </li>
                </ul>
              </UserMenuBody>
            </UserMenuInner>
          </StyledUserMenu>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.dashboard.user
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserMenu);
