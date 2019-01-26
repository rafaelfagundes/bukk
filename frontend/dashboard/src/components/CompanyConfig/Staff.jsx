import React, { Component } from "react";
import { connect } from "react-redux";

export class Staff extends Component {
  render() {
    return (
      <div>
        <h1>Funcionários</h1>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Staff);
