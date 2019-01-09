import React, { Component } from "react";
import { Button, Image, Icon, Form } from "semantic-ui-react";
import validator from "validator";
import "./Login.css";

export default class Login extends Component {
  state = {
    email: { error: false, msg: "" },
    password: { error: false, msg: "" }
  };

  enviarFormulario = () => {
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;

    if (validator.isEmpty(email)) {
      this.setState({
        email: { error: true, msg: "Por favor preencha seu email." }
      });
    } else {
      if (validator.isEmail(email)) {
        this.setState({ email: { error: false } });
      } else {
        this.setState({
          email: {
            error: true,
            msg: "Email inválido. Por favor verifique seu email."
          }
        });
      }
    }

    if (validator.isEmpty(password)) {
      this.setState({
        password: { error: true, msg: "Por favor preencha sua senha." }
      });
    } else {
      this.setState({ password: { error: false } });
    }
  };

  render() {
    return (
      <div className="outer">
        <div className="middle">
          <div className="inner">
            <div className="Login" id="Login">
              <Form onSubmit={this.enviarFormulario}>
                <Image
                  src="http://acmelogos.com/images/logo-7.svg"
                  size="small"
                  className="login-img"
                />
                <Form.Input
                  iconPosition="left"
                  placeholder="Digite seu email"
                  className="login-email"
                  type="email"
                  id="Email"
                >
                  <Icon name="at" />
                  <input />
                </Form.Input>
                {this.state.email.error && (
                  <span className="login-email-error">
                    {this.state.email.msg}
                  </span>
                )}
                <Form.Input
                  iconPosition="left"
                  placeholder="Digite sua senha"
                  className="login-password"
                  type="password"
                  id="Password"
                >
                  <Icon name="asterisk" />
                  <input />
                </Form.Input>
                {this.state.password.error && (
                  <span className="login-password-error">
                    {this.state.password.msg}
                  </span>
                )}
                <a href="/esqueci" className="login-forget">
                  Esqueceu sua senha?
                </a>
                <div className="buttons">
                  <a href="/criar-conta" className="login-create">
                    <Icon name="signup" />
                    Crie uma conta
                  </a>
                  <Form.Button color="green" animated>
                    <Button.Content visible>Entrar</Button.Content>
                    <Button.Content hidden>
                      <Icon name="arrow right" />
                    </Button.Content>
                  </Form.Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
