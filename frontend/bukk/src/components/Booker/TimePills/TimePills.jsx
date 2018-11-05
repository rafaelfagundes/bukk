import React, { Component } from "react";
import "./TimePills.css";
import Pill from "./Pill";
import { connect } from "react-redux";
import { setTime, setTimeTable } from "../bookerActions";

const mapStateToProps = state => {
  return {
    timeTable: state.booker.timeTable,
    currentService: state.booker.currentService,
    appointment: state.booker.appointment
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTime: time => dispatch(setTime(time)),
    setTimeTable: timeTable => dispatch(setTimeTable(timeTable))
  };
};

class TimePills extends Component {
  state = {
    timeTable: this.props.timeTable
  };
  handleClick = e => {
    this.props.appointment.services[
      this.props.currentService
    ].dateAndTime.time = e.target.innerText;
    this.props.setTime(this.props.appointment);

    for (let index = 0; index < this.props.timeTable.length; index++) {
      const element = this.props.timeTable[index];
      if (this.props.timeTable[index].time === e.target.innerText) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    }
    this.props.setTimeTable(this.props.timeTable);
    this.setState({ timeTable: this.props.timeTable });
  };
  render() {
    return (
      <div className="TimePillsContainer">
        <div className="TimePills">
          {this.state.timeTable.map(item => (
            <Pill key={item.time} item={item} onClick={this.handleClick} />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimePills);
