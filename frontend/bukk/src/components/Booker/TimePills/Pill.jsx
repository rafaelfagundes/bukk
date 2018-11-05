import React, { Component } from "react";

class Pill extends Component {
  render() {
    return (
      <div
        className={
          "ui medium label" + (this.props.item.selected ? " blue" : "")
        }
        onClick={this.props.onClick}
      >
        {this.props.item.time}
      </div>
    );
  }
}

export default Pill;
