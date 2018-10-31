import React, { Component } from "react";
import { Label } from "semantic-ui-react";
import "./TimePills.css";

var timeTable;

class TimePills extends Component {
  componentWillMount() {
    timeTable = [];
    this.populateTimeTable();
  }

  populateTimeTable() {
    var i, j;
    for (
      i = Number(this.props.startTime);
      i < Number(this.props.endTime);
      i++
    ) {
      for (j = 0; j < 60 / Number(this.props.minTimeFrame); j++) {
        timeTable.push(
          i + ":" + (j === 0 ? "00" : Number(this.props.minTimeFrame) * j)
        );
      }
    }
    for (let index = 0; index < this.props.excludeTimes.length; index++) {
      const element = this.props.excludeTimes[index];
      timeTable.splice(timeTable.indexOf(element), 1);
    }
  }

  render() {
    return (
      <div className="TimePillsContainer">
        <div className="TimePills">
          {timeTable.map(time => (
            <Label as="a" size="medium" key={time}>
              {time}
            </Label>
          ))}
        </div>
      </div>
    );
  }
}

export default TimePills;
