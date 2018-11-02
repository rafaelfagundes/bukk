import React, { Component } from "react";
import "./TimePills.css";
import Pill from "./Pill";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    timeTable: state.booker.timeTable
  };
};

class TimePills extends Component {
  render() {
    return (
      <div className="TimePillsContainer">
        <div className="TimePills">
          {this.props.timeTable.map(time => (
            <Pill key={time} time={time} />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(TimePills);
