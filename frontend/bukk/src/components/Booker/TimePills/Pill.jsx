import React, { Component } from "react";
import { Label } from "semantic-ui-react";

class Pill extends Component {
  state = {
    active: false
  };

  handleClick = e => {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  };

  render() {
    return (
      <Label
        as="a"
        size="medium"
        onClick={this.handleClick}
        className={this.state.active ? "blue" : null}
      >
        {this.props.time}
      </Label>
    );
  }
}

export default Pill;
