import React, { Component } from "react";
import { Label } from "semantic-ui-react";
import { connect } from "react-redux";
import { setTime, setTimeTable } from "../bookerActions";

const mapStateToProps = state => {
  return {
    currentService: state.booker.currentService,
    appointment: state.booker.appointment,
    timeTable: state.booker.timeTable
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTime: time => dispatch(setTime(time)),
    setTimeTable: timeTable => dispatch(setTimeTable(timeTable))
  };
};

class Pill extends Component {
  state = {
    active: true
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
  };

  render() {
    return (
      <Label
        as="a"
        size="medium"
        color={this.props.item.selected ? "blue" : null}
        onClick={this.handleClick}
      >
        {this.props.item.time}
      </Label>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pill);
