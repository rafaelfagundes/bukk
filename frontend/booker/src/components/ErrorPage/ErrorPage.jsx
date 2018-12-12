import React, { Component } from "react";
import { Icon, Header } from "semantic-ui-react";
import "./ErrorPage.css";

export default class ErrorPage extends Component {
  render() {
    return (
      <div className={"ErrorPage " + this.props.className}>
        <div className="error-header">
          <Icon
            className="error-icon"
            name="exclamation circle"
            size="huge"
            color="red"
          />
          <Header as="h1" className="error-title">
            {this.props.message}
          </Header>
        </div>
      </div>
    );
  }
}
