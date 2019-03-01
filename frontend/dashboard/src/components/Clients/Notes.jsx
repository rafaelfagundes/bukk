import React, { Component } from "react";
import { connect } from "react-redux";

export class Notes extends Component {
  render() {
    return <div>Notes</div>;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes);
