import React, { Component } from "react";
import { Image, Header } from "semantic-ui-react";
import "./Specialist.css";

class Specialist extends Component {
  render() {
    return (
      <div className="Specialist">
        <Image
          className={
            "specialist-img " +
            (this.props.selected ? "specialist-img__selected" : "")
          }
          src={this.props.image}
          circular
          size="small"
        />
        <Header className="specialist-name" as="h4">
          {this.props.firstName}
          <br />
          {this.props.lastName}
        </Header>
        <Header className="specialist-desc" sub>
          {this.props.desc}
        </Header>
      </div>
    );
  }
}

export default Specialist;
