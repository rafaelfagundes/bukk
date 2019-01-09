import React, { Component } from "react";
import { Button, Image, Icon, Form } from "semantic-ui-react";
import validator from "validator";
import "./Login.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import config from "../../config";

export default class Login extends Component {
  state = {
    email: { error: false, msg: "" },
    password: { error: false, msg: "" },
    login: { error: false, msg: "" },
    loading: false,
    isLoggedIn: false
  };

  sendForm = () => {
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;
    let error = false;

    if (validator.isEmpty(email)) {
      this.setState({
        email: { error: true, msg: "Por favor preencha seu email." }
      });
      error = true;
    } else {
      if (validator.isEmail(email)) {
        this.setState({ email: { error: false } });
        error = false;
      } else {
        this.setState({
          email: {
            error: true,
            msg: "Email inválido. Por favor verifique seu email."
          }
        });
        error = true;
      }
    }

    if (validator.isEmpty(password)) {
      this.setState({
        password: { error: true, msg: "Por favor preencha sua senha." }
      });
      error = true;
    } else {
      this.setState({ password: { error: false } });
      error = false;
    }

    if (!error) {
      this.setState({ loading: true });
      axios
        .post(config.api + "/users/login", {
          email,
          password
        })
        .then(response => {
          localStorage.setItem("token", "Bearer " + response.data.token);
          this.setState({
            loading: false,
            login: {
              error: false
            },
            isLoggedIn: true
          });
        })
        .catch(error => {
          this.setState({
            loading: false,
            login: {
              error: true,
              msg: "Não foi possível entrar: " + error.response.data.msg
            }
          });
        });
    }
  };

  render() {
    if (this.state.isLoggedIn) {
      return (
        <Redirect
          to={{ pathname: "/dashboard/", state: { from: this.props.location } }}
        />
      );
    }
    return (
      <div className="outer">
        <div className="middle">
          <div className="inner">
            {this.state.loading && (
              <div className="loading">
                <div className="spinner">
                  <div className="bounce1" />
                  <div className="bounce2" />
                  <div className="bounce3" />
                </div>
              </div>
            )}
            <div className="Login" id="Login">
              <Form onSubmit={this.sendForm}>
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
                {this.state.login.error && (
                  <span className="login-error">{this.state.login.msg}</span>
                )}
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
