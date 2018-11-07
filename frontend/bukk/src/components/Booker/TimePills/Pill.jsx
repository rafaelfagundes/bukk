import React, { Component } from "react";
// TODO: convert into stateless
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
