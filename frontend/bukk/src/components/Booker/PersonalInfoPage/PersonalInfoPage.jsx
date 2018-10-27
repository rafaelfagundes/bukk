import React, { Component } from "react";
import { Header } from "semantic-ui-react";

class PersonalInfoPage extends Component {
  render() {
    return (
      <div className="PersonalInfoPage">
        <Header as="h4" textAlign="left" color="blue">
          Preencha seus dados pessoais
        </Header>
      </div>
    );
  }
}

export default PersonalInfoPage;
