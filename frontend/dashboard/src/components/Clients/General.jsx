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
  Table,
  Input,
  Dropdown
} from "semantic-ui-react";
import { formatBrazilianPhoneNumber } from "../utils";
import { citiesStates } from "../../config/BrazilCitiesStates";
import _ from "lodash";

/* ============================================================================
  GLOBALS
============================================================================ */

const colorOptions = [
  {
    key: "red",
    text: "Vermelho",
    value: "red",
    label: { color: "red", circular: true, empty: true }
  },
  {
    key: "orange",
    text: "Laranja",
    value: "orange",
    label: { color: "orange", circular: true, empty: true }
  },
  {
    key: "yellow",
    text: "Amarelo",
    value: "yellow",
    label: { color: "yellow", circular: true, empty: true }
  },

  {
    key: "green",
    text: "Verde",
    value: "green",
    label: { color: "green", circular: true, empty: true }
  },
  {
    key: "teal",
    text: "Verde-Azulado",
    value: "teal",
    label: { color: "teal", circular: true, empty: true }
  },
  {
    key: "blue",
    text: "Azul",
    value: "blue",
    label: { color: "blue", circular: true, empty: true }
  },
  {
    key: "violet",
    text: "Violeta",
    value: "violet",
    label: { color: "violet", circular: true, empty: true }
  },
  {
    key: "purple",
    text: "Roxo",
    value: "purple",
    label: { color: "purple", circular: true, empty: true }
  },
  {
    key: "pink",
    text: "Rosa",
    value: "pink",
    label: { color: "pink", circular: true, empty: true }
  },
  {
    key: "brown",
    text: "Marrom",
    value: "brown",
    label: { color: "brown", circular: true, empty: true }
  },
  {
    key: "grey",
    value: "grey",
    text: "Cinza",
    label: { color: "grey", circular: true, empty: true }
  },
  {
    key: "black",
    text: "Preto",
    value: "black",
    label: { color: "black", circular: true, empty: true }
  }
];

/* ========================================================================= */

/* ============================================================================
  COMPONENTS
============================================================================ */

const Tag = props => (
  <Label
    as="a"
    color={props.color}
    key={props.index}
    {...props}
    className={props.className}
  >
    {props.text}
    <Icon name="delete" onClick={() => alert("remover tag")} />
  </Label>
);

/* ========================================================================= */

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
  /* max-height: 80vh !important; */
  /* overflow: auto; */
`;

const TagInput = styled(Input)`
  /* margin-top: 23px; */

  width: 100%;

  > div > div > div > .label {
    border-radius: 50% !important;
  }

  > .ui .dropdown .label {
  }
`;

const StyledTag = styled(Tag)`
  margin-bottom: 3px !important;
`;

/* ========================================================================= */

export class General extends Component {
  state = {
    page: "edit",
    client: this.props.client,
    info: {
      title: "",
      text: ""
    },
    showInfoForm: false,
    tag: {
      color: "blue",
      text: ""
    },
    states: [],
    cities: []
  };

  componentDidMount() {
    this.populateStates();
    this.setState({
      client: {
        ...this.state.client,
        address: {
          street: "",
          number: "",
          neighborhood: "",
          city: "",
          state: "",
          country: "",
          postalCode: ""
        }
      }
    });
  }

  populateStates = () => {
    const _states = [];
    citiesStates.estados.forEach(state => {
      _states.push({ key: state.nome, text: state.nome, value: state.nome });
    });

    this.setState({ states: _states });
  };

  populateCities = (e, { value }) => {
    const _state = _.find(citiesStates.estados, function(o) {
      return o.nome === value;
    });

    const _cities = [];
    _state.cidades.forEach(city => {
      _cities.push({ key: city, text: city, value: city });
    });

    this.setState({
      cities: _cities,
      client: {
        ...this.state.client,
        address: {
          ...this.state.client.address,
          state: value
        }
      }
    });
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

  addTag = () => {
    const _client = JSON.parse(JSON.stringify(this.state.client));

    _client.tags.push({
      color: this.state.tag.color,
      text: this.state.tag.text
    });

    this.setState({ client: _client, tag: { color: "grey", text: "" } });
  };

  handleTag = e => {
    this.setState({
      tag: {
        ...this.state.tag,
        text: e.currentTarget.value
      }
    });
  };

  handleTagColor = (e, { value }) => {
    this.setState({
      tag: {
        ...this.state.tag,
        color: value
      }
    });
  };

  handleTagKeyPress = e => {
    if (e.keyCode === 13) {
      this.addTag();
    }
  };

  handleAddress = (e, { value }) => {
    if (e.currentTarget.name !== undefined) {
      this.setState({
        client: {
          ...this.state.client,
          address: {
            ...this.state.client.address,
            [e.currentTarget.name]: e.currentTarget.value
          }
        }
      });
    } else {
      this.setState({
        client: {
          ...this.state.client,
          address: {
            ...this.state.client.address,
            city: value
          }
        }
      });
    }
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
                <Form>
                  <FormSubTitle text="Endereço" first />
                  {this.state.client.address && (
                    <>
                      <Form.Group>
                        <Form.Input
                          width={12}
                          id="street"
                          name="street"
                          label="Rua"
                          placeholder="Rua"
                          onChange={this.handleAddress}
                          value={this.state.client.address.street}
                        />
                        <Form.Input
                          width={4}
                          id="number"
                          name="number"
                          label="Número"
                          placeholder="Número"
                          onChange={this.handleAddress}
                          value={this.state.client.address.number}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Select
                          label="Estado"
                          placeholder="Estado"
                          options={this.state.states}
                          onChange={this.populateCities}
                          value={this.state.client.address.state}
                          width={7}
                          search
                        />
                        <Form.Select
                          label="Cidade"
                          placeholder="Cidade"
                          options={this.state.cities}
                          width={11}
                          onChange={this.handleAddress}
                          value={this.state.client.address.city}
                          search
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Input
                          id="neighborhood"
                          name="neighborhood"
                          label="Bairro"
                          placeholder="Bairro"
                          onChange={this.handleAddress}
                          value={this.state.client.address.neighborhood}
                          width={11}
                        />
                        <Form.Input
                          id="postalCode"
                          name="postalCode"
                          label="CEP"
                          placeholder="CEP"
                          onChange={this.handleAddress}
                          value={this.state.client.address.postalCode}
                          width={5}
                        />
                      </Form.Group>
                    </>
                  )}
                </Form>
                {this.state.client.tags.length > 0 && (
                  <>
                    <FormSubTitle text="Tags" />
                    <TagInput
                      label={
                        <Dropdown
                          defaultValue={this.state.tag.color}
                          options={colorOptions}
                          onChange={this.handleTagColor}
                        />
                      }
                      action={<Button icon="plus" color="blue" />}
                      labelPosition="left"
                      placeholder="Nova tag"
                      value={this.state.tag.text}
                      onChange={this.handleTag}
                      onKeyDown={this.handleTagKeyPress}
                    />
                    <Divider />
                    {this.state.client.tags.map((tag, index) => (
                      <StyledTag
                        color={tag.color}
                        key={index}
                        text={tag.text}
                      />
                    ))}
                  </>
                )}
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
            <pre>{JSON.stringify(this.state.client, null, 4)}</pre>
            {/* <pre>{JSON.stringify(this.state.client.tags, null, 4)}</pre> */}
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
