import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import config from "../../config";

export class Appointment extends Component {
  state = {
    confirmationId: ""
  };

  componentDidMount() {
    this.setState({ confirmationId: this.props.match.params.id });

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/appointments/get",
      { confirmationId: this.props.match.params.id },
      requestConfig
    )
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }

  render() {
    return (
      <div>
        <h2>{this.state.confirmationId}</h2>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Appointment);
