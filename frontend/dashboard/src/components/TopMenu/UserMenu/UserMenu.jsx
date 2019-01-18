import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import "./UserMenu.css";

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
  };
  render() {
    return (
      <>
        {this.state.visible && (
          <div className="user-menu">
            <div className="user-menu-inner">
              <div className="user-menu-header">
                <div className="user-menu-header-user-card">
                  <div className="user-menu-header-user-card-img">
                    <img src={this.props.user.avatar} className="" alt="" />
                  </div>
                  <div className="user-menu-header-user-card-details">
                    <span className="user-menu-header-user-card-details-name">
                      {this.props.user.firstName +
                        " " +
                        this.props.user.lastName}
                    </span>
                    <span className="user-menu-header-user-card-details-email">
                      {this.props.user.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="user-menu-body">
                <ul>
                  <li>
                    <Icon name="user" />
                    <a href="/dashboard/perfil">Meu perfil</a>
                  </li>
                  <li>
                    <Icon name="setting" />
                    <a href="/dashboard/configuracoes-empresa">
                      Configurações da empresa
                    </a>
                  </li>
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
              </div>
            </div>
          </div>
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
