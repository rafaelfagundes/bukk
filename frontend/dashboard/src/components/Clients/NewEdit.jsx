import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import FormTitle from "../Common/FormTitle";
import FormSubTitle from "../Common/FormSubTitle";
import Spinner from "react-spinkit";
import ValidationError from "../Common/ValidationError";
import { isEmail, isAlpha, isPostalCode } from "../validation";
import { toast } from "react-toastify";
import {
  Form,
  Table,
  Button,
  Dropdown,
  Divider,
  Icon,
  Checkbox,
  Input,
  Label
} from "semantic-ui-react";
import { formatBrazilianPhoneNumber, formatCEP } from "../utils";
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

const errorsTemplate = {
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  postalCode: "",
  birthday: ""
};

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
`;

const TagInput = styled(Input)`
  /* margin-top: 23px; */

  width: 100%;

  > div > div > div > .label {
    border-radius: 50% !important;
  }
`;

const StyledTag = styled(Tag)`
  margin-bottom: 3px !important;
`;

const ErrorHolder = styled.div`
  padding-bottom: 10px;
  margin-top: -10px;
`;

/* ========================================================================= */
export class NewEdit extends Component {
  state = {
    page: "view",
    newOrEdit: this.props.newOrEdit,
    client: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      phone: [
        {
          number: "",
          whatsApp: false
        }
      ],
      tags: [],
      address: {
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        country: "Brasil",
        postalCode: ""
      }
    },
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
    errors: errorsTemplate
  };

  getStates = () => {
    Axios.get(config.api + "/utils/getstates")
      .then(response => {
        let _states = [];
        response.data.states.forEach(state => {
          _states.push({
            key: state.abbr,
            text: state.name,
            value: state.name
          });
        });
        this.setState({ states: _states });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getCities = (state, event) => {
    let _state = state;
    if (event) {
      const { value } = event;
      _state = value;
    }

    Axios.get(config.api + "/utils/getcities", {
      params: {
        state: _state
      }
    })
      .then(response => {
        const _cities = response.data.cities.map(city => {
          return {
            key: city,
            text: city,
            value: city
          };
        });
        this.setState({
          cities: _cities,
          client: {
            ...this.state.client,
            address: {
              ...this.state.client.address,
              state: _state
            }
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    if (this.state.newOrEdit === "edit" && this.props.client) {
      this.setState({ client: this.props.client });
    }

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

    if (this.state.newOrEdit === "new") {
      setTimeout(() => {
        this.getStates();
      }, 250);
    } else {
      setTimeout(() => {
        this.getStates();
        this.getCities(this.state.client.address.state);
      }, 100);
    }
  }

  mapKeyToLabel = value => {
    const labels = {
      firstName: "Nome",
      lastName: "Sobrenome",
      email: "Email",
      gender: "Sexo",
      street: "Logradouro",
      number: "Número",
      neighborhood: "Bairro",
      city: "Cidade",
      state: "Estado",
      postalCode: "CEP"
    };

    return labels[value];
  };

  validate = () => {
    let _errors = JSON.parse(JSON.stringify(errorsTemplate));

    for (var key in this.state.client) {
      if (key === "firstName" || key === "lastName") {
        if (!isAlpha(this.state.client[key])) {
          _errors[key] = `O valor do campo ${this.mapKeyToLabel(
            key
          )} é inválido`;
        }
      }
      if (key === "email") {
        if (!isEmail(this.state.client[key])) {
          _errors[key] = `O valor do campo ${this.mapKeyToLabel(
            key
          )} é inválido`;
        }
      }
      if (this.state.client[key] === "") {
        _errors[key] = `Por favor, preencha o campo ${this.mapKeyToLabel(key)}`;
      }
      if (key === "address") {
        for (var key2 in this.state.client.address) {
          if (key2 === "street" || key2 === "neighborhood") {
            if (!isAlpha(this.state.client.address[key2])) {
              _errors[key2] = `O valor do campo ${this.mapKeyToLabel(
                key2
              )} é inválido`;
            }
          }

          if (key2 === "postalCode") {
            if (
              this.state.client.address[key2] !== "" &&
              !isPostalCode(this.state.client.address[key2])
            ) {
              _errors[key2] = `O valor do campo ${this.mapKeyToLabel(
                key2
              )} é inválido`;
            }
          }
          if (this.state.client.address[key2] === "") {
            _errors[key2] = `Por favor, preencha o campo ${this.mapKeyToLabel(
              key2
            )}`;
          }
        }
      }
    }

    let hasErrors = false;
    for (var error in _errors) {
      hasErrors = _errors[error] !== "";
    }
    this.setState({ errors: _errors });
    return !hasErrors;
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
    if (!this.validate()) {
      return false;
    }

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/costumers/save",
      { client: this.state.client, newOrEdit: this.state.newOrEdit },
      requestConfig
    )
      .then(response => {
        if (this.state.newOrEdit === "edit") {
          toast(
            <Notification
              type="success"
              title="Dados atualizados"
              text="Os dados foram atualizados com sucesso"
            />
          );
        } else {
          this.props.setPage("lista");
          this.props.history.push("/dashboard/clientes/lista");
          toast(
            <Notification
              type="success"
              title="Cliente Adicionado"
              text="O cliente foi adicionado com sucesso"
            />
          );
        }
      })
      .catch(error => {
        if (this.state.newOrEdit === "edit") {
          toast(
            <Notification
              type="error"
              title="Erro ao atualizar"
              text="Erro ao tentar atualizar os dados"
            />
          );
        } else {
          toast(
            <Notification
              type="error"
              title="Erro ao adicionar cliente"
              text="Não foi possível adicionar o novo cliente"
            />
          );
        }
      });
  };

  render() {
    return (
      <>
        {this.state.newOrEdit === "edit" && (
          <FormTitle text={`Editar Informações Básicas`} />
        )}
        {this.state.newOrEdit === "new" && (
          <FormTitle first text={`Novo Cliente`} />
        )}
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
                  error={this.state.errors.firstName !== ""}
                  onChange={e =>
                    this.handleChange("firstName", e.currentTarget.value)
                  }
                />
                <Form.Input
                  fluid
                  label="Sobrenome"
                  placeholder="Sobrenome"
                  value={this.state.client.lastName}
                  error={this.state.errors.lastName !== ""}
                  onChange={e =>
                    this.handleChange("lastName", e.currentTarget.value)
                  }
                />
              </Form.Group>
              <ErrorHolder>
                <ValidationError
                  show={this.state.errors.firstName !== ""}
                  error={this.state.errors.firstName}
                />
                <ValidationError
                  show={this.state.errors.lastName !== ""}
                  error={this.state.errors.lastName}
                />
              </ErrorHolder>
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
              <Form.Group>
                <Form.Field>
                  <label>Data de Nascimento</label>
                  <DatePicker
                    selected={this.state.client.birthday}
                    onChange={e => this.handleChange("birthday", e)}
                    locale="pt-BR"
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    scrollableYearDropdown
                    yearDropdownItemNumber={75}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                  />
                </Form.Field>
              </Form.Group>
              <ErrorHolder>
                <ValidationError
                  show={this.state.errors.gender !== ""}
                  error={this.state.errors.gender}
                />
              </ErrorHolder>
              <FormSubTitle text="Contato" />
              <Form.Group widths="equal">
                <Form.Input
                  label="Email"
                  placeholder="Email"
                  value={this.state.client.email}
                  error={this.state.errors.email !== ""}
                  onChange={e =>
                    this.handleChange("email", e.currentTarget.value)
                  }
                />
              </Form.Group>
              <ErrorHolder>
                <ValidationError
                  show={this.state.errors.email !== ""}
                  error={this.state.errors.email}
                />
              </ErrorHolder>
              <PhoneLabel className="field">
                {this.state.client.phone.length <= 1 && <label>Telefone</label>}
                {this.state.client.phone.length > 1 && <label>Telefones</label>}
              </PhoneLabel>
              <Table fixed singleLine compact striped>
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
                      label="Logradouro"
                      placeholder="Logradouro"
                      onChange={this.handleAddress}
                      error={this.state.errors.street !== ""}
                      value={this.state.client.address.street}
                    />
                    <Form.Input
                      width={4}
                      id="number"
                      name="number"
                      label="Número"
                      placeholder="Número"
                      onChange={this.handleAddress}
                      error={this.state.errors.number !== ""}
                      value={this.state.client.address.number}
                    />
                  </Form.Group>
                  <ErrorHolder>
                    <ValidationError
                      show={this.state.errors.street !== ""}
                      error={this.state.errors.street}
                    />
                    <ValidationError
                      show={this.state.errors.number !== ""}
                      error={this.state.errors.number}
                    />
                  </ErrorHolder>
                  <Form.Group>
                    {this.state.states.length === 0 && (
                      <Spinner
                        style={{
                          top: "6px",
                          left: "5px",
                          display: "inline-block"
                        }}
                        name="circle"
                      />
                    )}
                    {this.state.states.length > 0 && (
                      <Form.Select
                        label="Estado"
                        placeholder="Estado"
                        options={this.state.states}
                        onChange={this.getCities}
                        error={this.state.errors.state !== ""}
                        value={this.state.client.address.state}
                        width={7}
                        search
                      />
                    )}
                    {this.state.cities.length > 0 && (
                      <Form.Select
                        label="Cidade"
                        placeholder="Cidade"
                        options={this.state.cities}
                        width={11}
                        onChange={this.handleAddress}
                        error={this.state.errors.city !== ""}
                        value={this.state.client.address.city}
                        search
                      />
                    )}
                  </Form.Group>
                  <ErrorHolder>
                    <ValidationError
                      show={this.state.errors.state !== ""}
                      error={this.state.errors.state}
                    />
                    <ValidationError
                      show={this.state.errors.city !== ""}
                      error={this.state.errors.city}
                    />
                  </ErrorHolder>
                  <Form.Group>
                    <Form.Input
                      id="neighborhood"
                      name="neighborhood"
                      label="Bairro"
                      placeholder="Bairro"
                      onChange={this.handleAddress}
                      error={this.state.errors.neighborhood !== ""}
                      value={this.state.client.address.neighborhood}
                      width={11}
                    />
                    <Form.Input
                      id="postalCode"
                      name="postalCode"
                      label="CEP"
                      placeholder="CEP"
                      onChange={this.handleAddress}
                      error={this.state.errors.postalCode !== ""}
                      value={formatCEP(this.state.client.address.postalCode)}
                      width={5}
                    />
                  </Form.Group>
                  <ErrorHolder>
                    <ValidationError
                      show={this.state.errors.neighborhood !== ""}
                      error={this.state.errors.neighborhood}
                    />
                    <ValidationError
                      show={this.state.errors.postalCode !== ""}
                      error={this.state.errors.postalCode}
                    />
                  </ErrorHolder>
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
              action={<Button icon="plus" color="blue" onClick={this.addTag} />}
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
          {this.state.newOrEdit === "edit"
            ? "Atualizar Cliente"
            : "Adicionar Cliente"}
        </Button>

        <Button
          icon
          labelPosition="left"
          floated="right"
          onClick={() => this.props.history.goBack()}
        >
          <Icon name="delete" />
          Cancelar
        </Button>
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEdit);
