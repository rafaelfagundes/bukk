import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentPage } from "../dashboardActions";

export class Overview extends Component {
  state = {
    alreadyUpdated: false
  };
  componentDidMount() {
    console.log(this.props);
  }
  componentDidUpdate() {
    if (!this.state.alreadyUpdated && this.props.company) {
      this.props.setCurrentPage({
        icon: "home",
        title: this.props.company.companyNickname
      });
      this.setState({ alreadyUpdated: true });
    }
  }
  render() {
    return <div />;
  }
}

const mapStateToProps = state => {
  return {
    company: state.dashboard.company,
    currentPage: state.dashboard.currentPage,
    user: state.dashboard.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
