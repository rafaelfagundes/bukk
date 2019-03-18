import React, { Component } from "react";
import { Button, Image, Icon, Form } from "semantic-ui-react";
import validator from "validator";
import axios from "axios";
import { Redirect } from "react-router-dom";
import config from "../../config";
import styled, { keyframes } from "styled-components";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const bouncedelay = keyframes`
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
`;

const Loading = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  width: 380px;
  height: 320px;
  position: absolute;
  z-index: 1000;
  border-radius: 4px;
`;

const Spinner = styled.div`
  width: 70px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-35px, 11px);

  > div {
    width: 18px;
    height: 18px;
    background-color: #333;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: ${bouncedelay} 1.4s infinite ease-in-out both;
    animation: ${bouncedelay} 1.4s infinite ease-in-out both;
  }

  > .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  > .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
`;

const Outer = styled.div`
  display: table;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #f2f7ff;
`;

const Middle = styled.div`
  display: table-cell;
  vertical-align: middle;
`;

const Inner = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 380px;
`;

const StyledLogin = styled.div`
  box-sizing: border-box !important;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 40px 30px;
  background-color: white;
`;

const LoginImage = styled(Image)`
  margin: 0 auto;
  margin-bottom: 40px;
`;

const LoginEmail = styled(Form.Input)`
  margin-bottom: 20px !important;
`;

const EmailError = styled.div`
  color: #db2828;
  display: block;
  margin-top: -20px !important;
  margin-bottom: 20px !important;
`;

const PasswordError = styled.div`
  color: #db2828;
  display: block;
  margin-top: -14px !important;
  margin-bottom: 20px !important;
`;

const Error = styled.div`
  background-color: #db2828;
  color: white;
  width: 100%;
  display: block;
  text-align: center;
  padding: 10px 10px;
  border-radius: 4px;
  margin-top: -30px !important;
  margin-bottom: 20px !important;
`;

const LoginForget = styled.a`
  margin-top: -10px !important;
  padding-bottom: 40px;
  display: block;
`;

const LoginCreate = styled.a`
  font-weight: 700;
  line-height: 36px;
  margin: 0;
`;

const BottomButtons = styled.div`
  display: flex;
  flex-direction: row;

  > a {
    width: 70%;
  }

  > .field {
    width: 30%;
  }

  > .field > button {
    width: 100%;
  }
`;

/* ============================================================================ */

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

    if (validator.isEmpty("" + email)) {
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

    if (validator.isEmpty("" + password)) {
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
      <Outer>
        <Middle>
          <Inner>
            {this.state.loading && (
              <Loading>
                <Spinner>
                  <div className="bounce1" />
                  <div className="bounce2" />
                  <div className="bounce3" />
                </Spinner>
              </Loading>
            )}
            <StyledLogin>
              <Form onSubmit={this.sendForm}>
                <LoginImage
                  src="http://acmelogos.com/images/logo-7.svg"
                  size="small"
                />
                <LoginEmail
                  iconPosition="left"
                  placeholder="Digite seu email"
                  type="email"
                  id="Email"
                >
                  <Icon name="at" />
                  <input />
                </LoginEmail>
                {this.state.email.error && (
                  <EmailError className="login-email-error">
                    {this.state.email.msg}
                  </EmailError>
                )}
                <Form.Input
                  iconPosition="left"
                  placeholder="Digite sua senha"
                  type="password"
                  id="Password"
                >
                  <Icon name="asterisk" />
                  <input />
                </Form.Input>
                {this.state.password.error && (
                  <PasswordError className="login-password-error">
                    {this.state.password.msg}
                  </PasswordError>
                )}
                <LoginForget href="/esqueci" className="login-forget">
                  Esqueceu sua senha?
                </LoginForget>
                {this.state.login.error && (
                  <Error>{this.state.login.msg}</Error>
                )}
                <BottomButtons>
                  <LoginCreate href="/criar-conta">
                    <Icon name="signup" />
                    Crie uma conta
                  </LoginCreate>
                  <Form.Button color="green" animated>
                    <Button.Content visible>Entrar</Button.Content>
                    <Button.Content hidden>
                      <Icon name="arrow right" />
                    </Button.Content>
                  </Form.Button>
                </BottomButtons>
              </Form>
            </StyledLogin>
          </Inner>
        </Middle>
      </Outer>
    );
  }
}
