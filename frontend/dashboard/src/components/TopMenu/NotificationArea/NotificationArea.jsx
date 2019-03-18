import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Icon } from "semantic-ui-react";

import styled from "styled-components";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const Notification = styled.div`
  top: 47px;
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

const NotificationInner = styled.div`
  background-color: #fff;
  box-shadow: 0px 5px 15px 1px rgba(69, 65, 78, 0.2);
  border-radius: 4px;
`;

const NotificationHeader = styled.div`
  padding: 20px 20px;
  box-shadow: 1px 34px 52px -19px rgba(68, 62, 84, 0.03);

  > div {
    font-weight: 400;
    font-size: 1.1rem;
    opacity: 0.9;
  }
  > div > span {
    min-width: 32px;
    min-height: 32px;
    background-color: #0e6eb8;
    border-radius: 32px;
    color: white;
    margin-right: 3px;
    padding: 5px 10px;
    font-weight: 700 !important;
  }
`;

const NotificationBody = styled.div`
  padding: 0 20px 5px 20px;
  > div > div:last-child {
    border-bottom: none;
  }
`;

const NotificationItem = styled.div`
  padding: 20px 0px 20px 0;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
`;

const NotificationItemDesc = styled.div`
  font-size: 1rem;
`;

const NotificationItemDetails = styled.div`
  font-size: 0.8rem;
  display: flex;
  flex-direction: row;
  opacity: 0.8;
  padding-top: 5px;

  > div {
    margin-right: 5px;
  }
`;

/* ============================================================================ */

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
    if (typeof event.target.className !== "string") {
      return false;
    } else {
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
    }
  };
  render() {
    return (
      <>
        {this.state.visible && (
          <Notification>
            <NotificationInner>
              <NotificationHeader>
                <div>
                  <span>5</span> Novas notificações
                </div>
              </NotificationHeader>

              <NotificationBody>
                <div>
                  <NotificationItem className="notification-area-item">
                    <NotificationItemDesc className="notification-area-item-desc">
                      Novo agendamento
                    </NotificationItemDesc>
                    <NotificationItemDetails className="notification-area-item-details">
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
                    </NotificationItemDetails>
                  </NotificationItem>
                  <NotificationItem className="notification-area-item">
                    <NotificationItemDesc className="notification-area-item-desc">
                      Novo agendamento
                    </NotificationItemDesc>
                    <NotificationItemDetails className="notification-area-item-details">
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
                    </NotificationItemDetails>
                  </NotificationItem>
                  <NotificationItem className="notification-area-item">
                    <NotificationItemDesc className="notification-area-item-desc">
                      Cancelamento
                    </NotificationItemDesc>
                    <NotificationItemDetails className="notification-area-item-details">
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
                    </NotificationItemDetails>
                  </NotificationItem>
                  <NotificationItem className="notification-area-item">
                    <NotificationItemDesc className="notification-area-item-desc">
                      Novo agendamento
                    </NotificationItemDesc>
                    <NotificationItemDetails className="notification-area-item-details">
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
                    </NotificationItemDetails>
                  </NotificationItem>
                </div>
              </NotificationBody>
            </NotificationInner>
          </Notification>
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
