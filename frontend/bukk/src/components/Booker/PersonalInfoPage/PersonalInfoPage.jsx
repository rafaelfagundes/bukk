import React, { Component } from "react";
import { Header, Form, Icon } from "semantic-ui-react";

class PersonalInfoPage extends Component {
  render() {
    return (
      <div className="PersonalInfoPage">
        <Header as="h4" color="blue">
          Preencha seus dados pessoais
        </Header>
        <Form>
          <Form.Group>
            <Form.Input label="Nome" placeholder="Nome" width={6} />
            <Form.Input label="Sobrenome" placeholder="Sobrenome" width={6} />
          </Form.Group>
          <Form.Group>
            <Form.Input label="Email" placeholder="Email" width={6} />
          </Form.Group>
          <Form.Group>
            <Form.Input label="Telefone" placeholder="Telefone" width={6} />
            <Form.Checkbox
              toggle
              inline
              label="É um número WhatsApp?"
              className="pt30px"
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
            />
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default PersonalInfoPage;
