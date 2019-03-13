import React, { Component } from "react";
import { connect } from "react-redux";
import FormTitle from "../Common/FormTitle";
import styled from "styled-components";
import { toast } from "react-toastify";
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
import { formatBrazilianPhoneNumber, formatCEP } from "../utils";
import { citiesStates } from "../../config/BrazilCitiesStates";
import _ from "lodash";
import config from "../../config";
import Axios from "axios";
import Notification from "../Notification/Notification";

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
    className={props.className}
  >
    {props.text}
    <Icon name="delete" onClick={props.onClick} />
  </Label>
);

/* ========================================================================= */

/* ============================================================================
  STYLED COMPONENTS
============================================================================ */

const TwoColumns = styled.div`
  display: flex;
  flex-direction: row;

  > div {
    width: 50%;
  }
`;

const ThreeColumns = styled.div`
  display: flex;
  flex-direction: row;

  > div {
    width: 33%;
  }
`;

const StyledLabel = styled.span`
  opacity: 0.8;
`;

const PhoneLabel = styled.div`
  margin: 0px 0 -10px 0 !important;
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
    cities: [],
    newPhone: {
      number: "",
      whatsApp: false
    }
  };

  componentDidMount() {
    this.populateStates();

    if (!this.state.client.address) {
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
  }

  componentDidUpdate() {
    if (
      this.state.client.address.state !== "" &&
      this.state.cities.length === 0
    ) {
      this.getCities(this.state.client.address.state);
    }
  }

  populateStates = () => {
    const _states = [];
    citiesStates.estados.forEach(state => {
      _states.push({ key: state.nome, text: state.nome, value: state.nome });
    });

    this.setState({ states: _states });
  };

  populateCities = (e, { value }) => {
    this.getCities(value);
  };

  getCities(value) {
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
  }

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

  removeTag = index => {
    const _tags = JSON.parse(JSON.stringify(this.state.client.tags));
    _tags.splice(index, 1);

    this.setState({
      client: {
        ...this.state.client,
        tags: _tags
      }
    });
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

  handleChange = (key, value) => {
    this.setState({
      client: {
        ...this.state.client,
        [key]: value
      }
    });
  };

  handlePhoneChange = (index, key, value) => {
    const _phones = this.state.client.phone;

    _phones[index][key] = value;

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

  save = () => {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/costumers/save",
      { client: this.state.client },
      requestConfig
    )
      .then(response => {
        console.log(response.data);
        toast(
          <Notification
            type="success"
            title="Dados atualizados"
            text="Os dados foram atualizados com sucesso"
          />
        );
      })
      .catch(error => {
        console.log(error.response.data);
        toast(
          <Notification
            type="error"
            title="Erro ao atualizar"
            text="Erro ao tentar atualizar os dados"
          />
        );
      });
  };

  render() {
    const { client } = this.props;
    return (
      <>
        {this.state.page === "view" && (
          <>
            <FormTitle first text={`Informações Básicas`} />
            <ThreeColumns>
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
              </div>
              <div>
                {client.address && (
                  <>
                    <FormSubTitle text="Endereço" first />
                    <p>
                      <StyledLabel>Logradouro: </StyledLabel>
                      {client.address.street}
                      {", "}
                      {client.address.number}
                    </p>
                    <p>
                      <StyledLabel>Bairro: </StyledLabel>
                      {client.address.neighborhood}
                    </p>
                    <p>
                      <StyledLabel>Cidade: </StyledLabel>
                      {client.address.city}
                    </p>
                    <p>
                      <StyledLabel>Estado: </StyledLabel>
                      {client.address.state}
                    </p>
                    <p>
                      <StyledLabel>CEP: </StyledLabel>
                      {formatCEP(client.address.postalCode)}
                    </p>
                  </>
                )}
              </div>
              <div>
                {client.tags.length > 0 && (
                  <>
                    <FormSubTitle text="Tags" first />
                    {client.tags.map((tag, index) => (
                      <Label color={tag.color} key={tag.text}>
                        {tag.text}
                      </Label>
                    ))}
                  </>
                )}
              </div>
            </ThreeColumns>
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
            <FormTitle first text={`Editar Informações Básicas`} />
            <TwoColumns>
              <BasicColumn>
                <FormSubTitle text="Informações Pessoais" first />
                <Form>
                  <Form.Group widths="equal">
                    <Form.Input
                      fluid
                      label="Nome"
                      placeholder="Nome"
                      value={this.state.client.firstName}
                      onChange={e =>
                        this.handleChange("firstName", e.currentTarget.value)
                      }
                    />
                    <Form.Input
                      fluid
                      label="Sobrenome"
                      placeholder="Sobrenome"
                      value={this.state.client.lastName}
                      onChange={e =>
                        this.handleChange("lastName", e.currentTarget.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <label>Sexo</label>
                    <Form.Radio
                      label="Feminino"
                      value="F"
                      checked={this.state.client.gender === "F"}
                      onChange={e => this.handleChange("gender", "F")}
                    />
                    <Form.Radio
                      label="Masculino"
                      value="M"
                      checked={this.state.client.gender === "M"}
                      onChange={e => this.handleChange("gender", "M")}
                    />
                    <Form.Radio
                      label="Outro"
                      value="O"
                      checked={this.state.client.gender === "O"}
                      onChange={e => this.handleChange("gender", "O")}
                    />
                  </Form.Group>
                  <FormSubTitle text="Contato" />
                  <Form.Group widths="equal">
                    <Form.Input
                      label="Email"
                      placeholder="Email"
                      value={this.state.client.email}
                      onChange={e =>
                        this.handleChange("email", e.currentTarget.value)
                      }
                    />
                  </Form.Group>
                  <PhoneLabel className="field">
                    {this.state.client.phone.length <= 1 && (
                      <label>Telefone</label>
                    )}
                    {this.state.client.phone.length > 1 && (
                      <label>Telefones</label>
                    )}
                  </PhoneLabel>
                  <Table fixed singleLine compact striped>
                    {/* <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell width={8}>Telefone</Table.HeaderCell>
                        <Table.HeaderCell width={6} />
                        {this.state.client.phone.length > 1 && (
                          <Table.HeaderCell width={2} />
                        )}
                      </Table.Row>
                    </Table.Header> */}

                    <Table.Body>
                      {this.state.client.phone.map((phone, index) => (
                        <Table.Row key={index}>
                          <Table.Cell width={4}>
                            <Form.Input
                              placeholder={`Telefone ${index + 1}`}
                              value={formatBrazilianPhoneNumber(phone.number)}
                              id={index}
                              onChange={e =>
                                this.handlePhoneChange(
                                  index,
                                  "number",
                                  e.currentTarget.value
                                )
                              }
                            />
                          </Table.Cell>
                          <Table.Cell width={4}>
                            <Form.Field title="Informe se este número está vinculado ao WhatsApp">
                              <WhatsAppCheckbox
                                label="Número WhatsApp"
                                checked={phone.whatsApp}
                                onChange={e =>
                                  this.handlePhoneChange(
                                    index,
                                    "whatsApp",
                                    !phone.whatsApp
                                  )
                                }
                              />
                            </Form.Field>
                          </Table.Cell>
                          {this.state.client.phone.length > 1 && (
                            <Table.Cell textAlign="right" width={1}>
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
                <FormSubTitle text="Tags" />
                <TagInput
                  label={
                    <Dropdown
                      defaultValue={this.state.tag.color}
                      options={colorOptions}
                      onChange={this.handleTagColor}
                    />
                  }
                  action={
                    <Button icon="plus" color="blue" onClick={this.addTag} />
                  }
                  labelPosition="left"
                  placeholder="Nova tag"
                  value={this.state.tag.text}
                  onChange={this.handleTag}
                  onKeyDown={this.handleTagKeyPress}
                />
                {this.state.client.tags.length > 0 && (
                  <>
                    <Divider />
                    {this.state.client.tags.map((tag, index) => (
                      <StyledTag
                        color={tag.color}
                        key={index}
                        text={tag.text}
                        onClick={() => this.removeTag(index)}
                      />
                    ))}
                  </>
                )}
              </OtherColumn>
            </TwoColumns>
            <Divider style={{ marginTop: "40px" }} />

            <Button icon labelPosition="left" color="green" onClick={this.save}>
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
            {/* <pre>{JSON.stringify(this.state.client, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(this.state.client.tags, null, 4)}</pre>  */}
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
