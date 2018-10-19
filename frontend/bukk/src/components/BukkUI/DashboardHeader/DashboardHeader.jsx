import React, { Component } from "react";
import { Header, Icon, Divider } from "semantic-ui-react";

class DashboardHeader extends Component {
  render() {
    return (
      <React.Fragment>
        <Header textAlign="left" as="h2">
          <Icon name={this.props.icon} />
          <Header.Content>
            {this.props.title}
            <Header.Subheader>{this.props.subtitle}</Header.Subheader>
          </Header.Content>
        </Header>
        <Divider />
      </React.Fragment>
    );
  }
}

export default DashboardHeader;
