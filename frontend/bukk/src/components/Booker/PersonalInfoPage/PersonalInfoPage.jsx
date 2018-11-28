import React, { Component } from "react";
import { Header, Form, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import { setClient, setPersonalInfoOk } from "../bookerActions";
import validator from "validator";

const mapStateToProps = state => {
  return {
    appointment: state.booker.appointment,
    personalInfoOk: state.booker.personalInfoOk
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setClient: appointment => dispatch(setClient(appointment)),
    setPersonalInfoOk: personalInfoOk =>
      dispatch(setPersonalInfoOk(personalInfoOk))
  };
};

class PersonalInfoPage extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: false,
    obs: "",
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    },
    warnings: {
      phone: ""
    }
  };

  validate = () => {
    let _errors = { firstName: "", lastName: "", email: "", phone: "" };
    let _warnings = { phone: "" };
    if (
      !validator.isEmpty(String(this.state.firstName)) &&
      !validator.isAlpha(String(this.state.firstName), "pt-BR")
    ) {
      _errors.firstName = "O nome deve conter somente letras.";
    }
    if (
      !validator.isEmpty(String(this.state.lastName)) &&
      !validator.isAlpha(String(this.state.lastName), "pt-BR")
    ) {
      _errors.lastName = "O sobrenome deve conter somente letras.";
    }
    if (
      !validator.isEmpty(String(this.state.email)) &&
      !validator.isEmail(String(this.state.email))
    ) {
      _errors.email = "Insira um email válido.";
    }

    if (
      !validator.isEmpty(String(this.state.phone)) &&
      (this.state.phone.length < 10 || this.state.phone.length > 11)
    ) {
      _errors.phone =
        "O número deve conter 10 ou 11 algarismos. Sendo DDD + Número. Exemplo: 32912349876";
    }
    if (
      this.state.whatsapp &&
      (validator.isEmpty(String(this.state.phone)) ||
        this.state.phone.length !== 11)
    ) {
      _errors.phone = "O número de WhatsApp deve ser de um telefone móvel.";
    }
    if (
      this.state.phone.length === 10 &&
      validator.isNumeric(String(this.state.phone))
    ) {
      _warnings.phone =
        "Dica: com um número de celular, você recebe lembretes por mensagem SMS.\nConfira seu número ou insira um número de celular.";
    }
    if (
      !validator.isEmpty(String(this.state.phone)) &&
      !validator.isNumeric(String(this.state.phone))
    ) {
      _errors.phone =
        "Por favor insira somente números. Sendo DDD + Número. Exemplo: 32912349876";
    }

    if (
      _errors.firstName === "" &&
      _errors.lastName === "" &&
      _errors.email === "" &&
      _errors.phone === "" &&
      this.state.firstName !== "" &&
      this.state.lastName !== "" &&
      this.state.email !== "" &&
      this.state.phone !== ""
    ) {
      this.props.setPersonalInfoOk(true);
    } else {
      this.props.setPersonalInfoOk(false);
    }
    this.setState({
      errors: _errors,
      warnings: _warnings
    });
  };

  handleChange = e => {
    if (e.currentTarget.id === "whatsapp") {
      this.setState({ [e.currentTarget.id]: e.currentTarget.checked }, () => {
        this.validate();
      });
    } else {
      this.setState({ [e.currentTarget.id]: e.currentTarget.value }, () => {
        this.validate();
      });
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
            <Form.Field width={6}>
              <Form.Input
                size="large"
                label="Nome *"
                placeholder="Nome"
                value={this.state.firstName}
                onChange={this.handleChange}
                id="firstName"
              />
              {this.state.errors.firstName !== "" && (
                <Label size="large" color="red" pointing>
                  {this.state.errors.firstName}
                </Label>
              )}
            </Form.Field>
            <Form.Field width={6}>
              <Form.Input
                size="large"
                label="Sobrenome *"
                placeholder="Sobrenome"
                value={this.state.lastName}
                onChange={this.handleChange}
                id="lastName"
              />
              {this.state.errors.lastName !== "" && (
                <Label size="large" color="red" pointing>
                  {this.state.errors.lastName}
                </Label>
              )}
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={8}>
              <Form.Input
                size="large"
                label="Email *"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
                id="email"
              />
              {this.state.errors.email !== "" && (
                <Label size="large" color="red" pointing>
                  {this.state.errors.email}
                </Label>
              )}
            </Form.Field>
          </Form.Group>

          <Form.Group>
            <Form.Field width={8}>
              <Form.Input
                size="large"
                label="Telefone *"
                placeholder="Telefone"
                value={this.state.phone}
                onChange={this.handleChange}
                id="phone"
              />
              {this.state.errors.phone !== "" && (
                <Label size="large" color="red" pointing>
                  {this.state.errors.phone}
                </Label>
              )}
              {this.state.warnings.phone !== "" && (
                <Label size="large" color="green" pointing>
                  {this.state.warnings.phone}{" "}
                </Label>
              )}
            </Form.Field>
            <Form.Field width={6}>
              <Form.Checkbox
                toggle
                inline
                size="large"
                label="Possui WhatsApp?"
                className="pt30px"
                onChange={this.handleChange}
                id="whatsapp"
                checked={this.state.whatsapp}
              />
            </Form.Field>
          </Form.Group>

          <Form.Group>
            <Form.TextArea
              size="large"
              label="Observações"
              placeholder="Observações"
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
