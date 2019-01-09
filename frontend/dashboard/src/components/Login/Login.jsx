import React, { Component } from "react";
import { Input, Button, Image, Icon } from "semantic-ui-react";
import "./Login.css";

export default class Login extends Component {
  render() {
    return (
      <div className="outer">
        <div className="middle">
          <div className="inner">
            <div className="Login" id="Login">
              <Image
                src="http://acmelogos.com/images/logo-7.svg"
                size="small"
                className="login-img"
              />
              <Input
                action={{ icon: "at" }}
                actionPosition="left"
                placeholder="Digite seu email"
                className="login-email"
              />
              <Input
                action={{ icon: "asterisk" }}
                actionPosition="left"
                placeholder="Digite sua senha"
                className="login-password"
              />
              <a href="/esqueci" className="login-forget">
                Esqueceu sua senha?
              </a>
              <div className="buttons">
                <a href="/criar-conta" className="login-create">
                  <Icon name="signup" />
                  Crie uma conta
                </a>
                <Button color="green" animated>
                  <Button.Content visible>Entrar</Button.Content>
                  <Button.Content hidden>
                    <Icon name="arrow right" />
                  </Button.Content>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
