import React, { Component } from "react";
import { connect } from "react-redux";
import FormTitle from "../Common/FormTitle";
import styled from "styled-components";
import FormSubTitle from "../Common/FormSubTitle";
import {
  Icon,
  Divider,
  Button,
  Label,
  Form,
  Checkbox,
  Table
} from "semantic-ui-react";
import { formatBrazilianPhoneNumber } from "../utils";

/* ============================================================================
  STYLED COMPONENTS
============================================================================ */

const Columns = styled.div`
  display: flex;
  flex-direction: row;

  > div {
    width: 50%;
  }
`;

const StyledLabel = styled.span`
  opacity: 0.8;
`;

const WhatsAppCheckbox = styled(Checkbox)`
  > label {
    color: rgb(25, 183, 25) !important;
    font-weight: bold;
  }
`;

const PhoneRemoveButton = styled(Button)``;

const BasicColumn = styled.div`
  padding-right: 40px;
  border-right: 1px solid #eee;
`;

const OtherColumn = styled.div`
  padding-left: 40px;
  max-height: 80vh !important;
  overflow: auto;
`;

const InformationCell = styled(Table.Cell)`
  padding: 20px !important;
`;

/* ========================================================================= */

const infoTypes = [
  { key: 1, text: "Pessoal", value: "personal" },
  { key: 2, text: "Contato", value: "contact" },
  { key: 3, text: "Outro", value: "other" }
];

export class General extends Component {
  state = {
    page: "view",
    client: this.props.client
  };

  toggleEdit = () => {
    if (this.state.page === "view") {
      this.setState({ page: "edit" });
    } else {
      this.setState({ page: "view" });
    }
  };

  addPhoneNumber = () => {
    let _phones = JSON.parse(JSON.stringify(this.state.client.phone));

    _phones.push({ whatsApp: false, number: "" });

    this.setState({
      client: {
        ...this.state.client,
        phone: _phones
      }
    });
  };

  removePhoneNumber = index => {
    let _phones = JSON.parse(JSON.stringify(this.state.client.phone));

    _phones.splice(index, 1);

    this.setState({
      client: {
        ...this.state.client,
        phone: _phones
      }
    });
  };

  mapGender(gender) {
    if (gender === "F") {
      return (
        <>
          <Icon name="venus" />
          Feminino
        </>
      );
    } else if (gender === "M") {
      return (
        <>
          <Icon name="mars" />
          Masculino
        </>
      );
    } else {
      return (
        <>
          <Icon name="genderless" />
          Outro
        </>
      );
    }
  }

  mapPhone(number, whatsApp) {
    if (whatsApp) {
      return (
        <>
          {formatBrazilianPhoneNumber(number)}{" "}
          <Icon name="whatsapp" color="green" />
        </>
      );
    } else {
      return formatBrazilianPhoneNumber(number);
    }
  }

  render() {
    const { client } = this.props;
    return (
      <>
        {this.state.page === "view" && (
          <>
            <FormTitle
              first
              text={`Dados de ${client.firstName} ${client.lastName}`}
            />
            <Columns>
              <div>
                <FormSubTitle first text="Dados Pessoais" />
                <p>
                  <StyledLabel>Nome: </StyledLabel>
                  {client.firstName} {client.lastName}
                </p>
                <p>
                  <StyledLabel>Sexo: </StyledLabel>
                  {this.mapGender(client.gender)}
                </p>
                {client.otherInfo.personal.map((o, index) => (
                  <p key={index}>
                    <StyledLabel>{o.title}: </StyledLabel>
                    {o.text}
                  </p>
                ))}
                <FormSubTitle text="Contato" />
                <p>
                  <StyledLabel>Email: </StyledLabel>
                  {client.email}
                </p>
                {client.phone.map((phone, index) => (
                  <p key={index}>
                    <StyledLabel>Telefone {index + 1} : </StyledLabel>
                    {this.mapPhone(phone.number, phone.whatsApp)}
                  </p>
                ))}
                {client.otherInfo.contact.map((o, index) => (
                  <p key={index}>
                    <StyledLabel>{o.title}: </StyledLabel>
                    {o.text}
                  </p>
                ))}
              </div>
              <div>
                {client.otherInfo.other.length > 0 && (
                  <>
                    <FormSubTitle first text="Outras Informações" />
                    {client.otherInfo.other.map((o, index) => (
                      <p key={index}>
                        <StyledLabel>{o.title}: </StyledLabel>
                        {o.text}
                      </p>
                    ))}
                  </>
                )}
                {client.tags.length > 0 && (
                  <>
                    <FormSubTitle text="Tags" />
                    {client.tags.map((tag, index) => (
                      <Label color={tag.color} key={tag.text}>
                        {tag.text}
                      </Label>
                    ))}
                  </>
                )}
                {/* <pre>{JSON.stringify(this.props.client, null, 2)}</pre> */}
              </div>
            </Columns>
            <Divider style={{ marginTop: "40px" }} />

            <Button
              icon
              labelPosition="left"
              color="green"
              onClick={this.toggleEdit}
            >
              <Icon name="pencil" />
              Editar Informações
            </Button>

            <Button
              icon
              labelPosition="left"
              floated="right"
              onClick={() => this.props.history.goBack()}
            >
              <Icon name="arrow left" />
              Voltar
            </Button>
          </>
        )}
        {this.state.page === "edit" && (
          <>
            <FormTitle
              first
              text={`Editar Dados de ${client.firstName} ${client.lastName}`}
            />
            <Columns>
              <BasicColumn>
                <FormSubTitle text="Informações Pessoais" first />
                <Form>
                  <Form.Group widths="equal">
                    <Form.Input
                      fluid
                      label="Nome"
                      placeholder="Nome"
                      value={this.state.client.firstName}
                    />
                    <Form.Input
                      fluid
                      label="Sobrenome"
                      placeholder="Sobrenome"
                      value={this.state.client.lastName}
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <label>Sexo</label>
                    <Form.Radio
                      label="Feminino"
                      value="F"
                      checked={this.state.client.gender === "F"}
                      onChange={this.handleChange}
                    />
                    <Form.Radio
                      label="Masculino"
                      value="M"
                      checked={this.state.client.gender === "M"}
                      onChange={this.handleChange}
                    />
                    <Form.Radio
                      label="Outro"
                      value="O"
                      checked={this.state.client.gender === "O"}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <FormSubTitle text="Contato" />
                  <Form.Group widths="equal">
                    <Form.Input
                      label="Email"
                      placeholder="Email"
                      value={this.state.client.email}
                    />
                  </Form.Group>
                  <Table fixed singleLine>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell width={8}>Telefone</Table.HeaderCell>
                        <Table.HeaderCell width={6} />
                        {this.state.client.phone.length > 1 && (
                          <Table.HeaderCell width={2} />
                        )}
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {this.state.client.phone.map((phone, index) => (
                        <Table.Row key={index + phone.number}>
                          <Table.Cell>
                            <Form.Input
                              placeholder={`Telefone ${index + 1}`}
                              value={formatBrazilianPhoneNumber(phone.number)}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Form.Field title="Informe se este número está vinculado ao WhatsApp">
                              <WhatsAppCheckbox
                                label="Número WhatsApp"
                                checked={phone.whatsApp}
                              />
                            </Form.Field>
                          </Table.Cell>
                          {this.state.client.phone.length > 1 && (
                            <Table.Cell textAlign="right">
                              <Form.Field>
                                <PhoneRemoveButton
                                  icon="delete"
                                  title="Remover telefone"
                                  onClick={() => this.removePhoneNumber(index)}
                                  compact
                                  inverted
                                  color="red"
                                />
                              </Form.Field>
                            </Table.Cell>
                          )}
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                  <Form.Group>
                    <Form.Field>
                      <Button
                        icon="plus"
                        content="Adicionar Telefone"
                        title="Adicione mais um número de telefone"
                        color="blue"
                        onClick={this.addPhoneNumber}
                        compact
                      />
                    </Form.Field>
                  </Form.Group>
                </Form>
              </BasicColumn>
              <OtherColumn>
                {this.state.client.tags.length > 0 && (
                  <>
                    <FormSubTitle text="Tags" first />
                    {this.state.client.tags.map((tag, index) => (
                      <Label as="a" color={tag.color} key={index}>
                        {tag.text}
                        <Icon
                          name="delete"
                          onClick={() => alert("remover tag")}
                        />
                      </Label>
                    ))}
                  </>
                )}
                <FormSubTitle
                  text="Outras Informações"
                  first={this.state.client.tags.length === 0}
                />
                {(client.otherInfo.personal.length > 0 ||
                  client.otherInfo.contact.length > 0 ||
                  client.otherInfo.other.length > 0) && (
                  <Table fixed singleLine>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell width={5}>Item</Table.HeaderCell>
                        <Table.HeaderCell width={8}>Texto</Table.HeaderCell>
                        <Table.HeaderCell textAlign="right" width={2} />
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {this.state.client.otherInfo.personal.map(
                        (info, index) => (
                          <Table.Row key={index}>
                            <Table.Cell title={info.title}>
                              {info.title}
                            </Table.Cell>
                            <Table.Cell title={info.text}>
                              {info.text}
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                              <Button
                                icon="edit"
                                compact
                                inverted
                                color="blue"
                              />
                            </Table.Cell>
                          </Table.Row>
                        )
                      )}
                      {this.state.client.otherInfo.contact.map(
                        (info, index) => (
                          <Table.Row key={index}>
                            <Table.Cell title={info.title}>
                              {info.title}
                            </Table.Cell>
                            <Table.Cell title={info.text}>
                              {info.text}
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                              <Button
                                icon="edit"
                                compact
                                inverted
                                color="blue"
                              />
                            </Table.Cell>
                          </Table.Row>
                        )
                      )}
                      {this.state.client.otherInfo.other.map((info, index) => (
                        <Table.Row key={index}>
                          <Table.Cell title={info.title}>
                            {info.title}
                          </Table.Cell>
                          <Table.Cell title={info.text}>{info.text}</Table.Cell>
                          <Table.Cell textAlign="right">
                            <Button icon="edit" compact inverted color="blue" />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                )}

                <Button
                  icon="plus"
                  content="Adicionar Informação"
                  title="Adicione informações sobre o cliente"
                  color="blue"
                  onClick={this.addPhoneNumber}
                  compact
                />
              </OtherColumn>
            </Columns>
            <Divider style={{ marginTop: "40px" }} />

            <Button icon labelPosition="left" color="green">
              <Icon name="cloud" />
              Atualizar Cliente
            </Button>

            <Button
              icon
              labelPosition="left"
              floated="right"
              onClick={this.toggleEdit}
            >
              <Icon name="delete" />
              Cancelar
            </Button>
            <pre>{JSON.stringify(this.props.client, null, 2)}</pre>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(General);
