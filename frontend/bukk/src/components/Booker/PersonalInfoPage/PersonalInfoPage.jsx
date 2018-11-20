import React, { Component } from "react";
import { Header, Form, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { setClient } from "../bookerActions";

const mapStateToProps = state => {
  return {
    appointment: state.booker.appointment
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setClient: appointment => dispatch(setClient(appointment))
  };
};

class PersonalInfoPage extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: false,
    obs: ""
  };

  handleChange = e => {
    if (e.currentTarget.id === "whatsapp") {
      this.setState({ [e.currentTarget.id]: e.currentTarget.checked });
    } else {
      this.setState({ [e.currentTarget.id]: e.currentTarget.value });
    }
  };

  componentDidUpdate() {
    this.props.appointment.client = this.state;
    this.props.setClient(this.props.appointment);
  }

  render() {
    return (
      <div className={"PersonalInfoPage " + this.props.className}>
        <Header as="h3" color="blue">
          Preencha seus dados pessoais
        </Header>
        <Form>
          <Form.Group>
            <Form.Input
              label="Nome"
              placeholder="Nome"
              width={6}
              value={this.state.firstName}
              onChange={this.handleChange}
              id="firstName"
            />
            <Form.Input
              label="Sobrenome"
              placeholder="Sobrenome"
              width={6}
              value={this.state.lastName}
              onChange={this.handleChange}
              id="lastName"
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label="Email"
              placeholder="Email"
              width={6}
              value={this.state.email}
              onChange={this.handleChange}
              id="email"
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label="Telefone"
              placeholder="Telefone"
              width={6}
              value={this.state.phone}
              onChange={this.handleChange}
              id="phone"
            />
            <Form.Checkbox
              toggle
              inline
              label="É um número WhatsApp?"
              className="pt30px"
              onChange={this.handleChange}
              id="whatsapp"
              checked={this.state.whatsapp}
            />
            <Icon
              name="whatsapp"
              color="green"
              className="pt30px"
              size="large"
            />
          </Form.Group>
          <Form.Group>
            <Form.TextArea
              label="Observações / Notas"
              placeholder="Observações / Notas"
              width={12}
              rows="8"
              value={this.state.obs}
              onChange={this.handleChange}
              id="obs"
            />
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalInfoPage);
