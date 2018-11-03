import React, { Component } from "react";
import "./TimePills.css";
import Pill from "./Pill";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    timeTable: state.booker.timeTable,
    currentService: state.booker.currentService,
    appointment: state.booker.appointment
  };
};

class TimePills extends Component {
  render() {
    return (
      <div className="TimePillsContainer">
        <div className="TimePills">
          {this.props.timeTable.map(item => (
            <Pill key={item.time + item.selected} item={item} />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(TimePills);
