import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import "./NotificationArea.css";
import { Icon } from "semantic-ui-react";

export class NotificationArea extends Component {
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

    // if clicked in a node above the trigger
    let parent = -1;
    if (event.target.offsetParent) {
      parent = event.target.offsetParent.className.indexOf(
        this.props.triggerClass
      );
    }
    if (
      event.target.className.indexOf(this.props.triggerClass) >= 0 ||
      parent > 0
    ) {
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
          <div className="notification-area">
            <div className="notification-area-inner">
              <div className="notification-area-header">
                <div className="notification-area-header-txt">
                  <span className="notification-area-header-counter">4</span>{" "}
                  Novas notificações
                </div>
              </div>

              <div className="notification-area-body">
                <div className="notifation-area-list">
                  <div className="notification-area-item">
                    <div className="notification-area-item-desc">
                      Novo agendamento
                    </div>
                    <div className="notification-area-item-details">
                      <div className="notification-area-item-time">
                        <Icon name="clock outline" />
                        09:45
                      </div>
                      <div className="notification-area-item-user">
                        <Icon name="user outline" />
                        Rogério
                      </div>
                      <div className="notification-area-item-action">
                        <Icon name="envelope open outline" />
                        Marcar como lido
                      </div>
                    </div>
                  </div>
                  <div className="notification-area-item">
                    <div className="notification-area-item-desc">
                      Novo agendamento
                    </div>
                    <div className="notification-area-item-details">
                      <div className="notification-area-item-time">
                        <Icon name="clock outline" />
                        11:01
                      </div>
                      <div className="notification-area-item-user">
                        <Icon name="user outline" />
                        Maurílio
                      </div>
                      <div className="notification-area-item-action">
                        <Icon name="envelope open outline" />
                        Marcar como lido
                      </div>
                    </div>
                  </div>
                  <div className="notification-area-item">
                    <div className="notification-area-item-desc">
                      Cancelamento
                    </div>
                    <div className="notification-area-item-details">
                      <div className="notification-area-item-time">
                        <Icon name="clock outline" />
                        11:14
                      </div>
                      <div className="notification-area-item-user">
                        <Icon name="user outline" />
                        Renan
                      </div>
                      <div className="notification-area-item-action">
                        <Icon name="envelope open outline" />
                        Marcar como lido
                      </div>
                    </div>
                  </div>
                  <div className="notification-area-item">
                    <div className="notification-area-item-desc">
                      Novo agendamento
                    </div>
                    <div className="notification-area-item-details">
                      <div className="notification-area-item-time">
                        <Icon name="clock outline" />
                        14:37
                      </div>
                      <div className="notification-area-item-user">
                        <Icon name="user outline" />
                        Júlio
                      </div>
                      <div className="notification-area-item-action">
                        <Icon name="envelope open outline" />
                        Marcar como lido
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationArea);
