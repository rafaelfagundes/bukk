import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import "./Booker.css";

class Booker extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Grid.Row>
          <Grid.Column>
            <div className="Booker">
              <h1>Agendar</h1>
            </div>
          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    );
  }
}

export default Booker;
