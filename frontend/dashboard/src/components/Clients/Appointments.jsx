import React, { Component } from "react";
import { connect } from "react-redux";

export class Appointments extends Component {
  render() {
    return <div>Agendamentos</div>;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Appointments);
