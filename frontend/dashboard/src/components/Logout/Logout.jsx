import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("employee");
    localStorage.removeItem("company");
  }

  render() {
    return (
      <div>
        <Redirect
          to={{ pathname: "/dashboard", state: { from: this.props.location } }}
        />
      </div>
    );
  }
}
