import { connect } from "react-redux";
import {
  Form,
  Image,
  Button,
  Icon,
  Divider,
  Modal,
  Header
} from "semantic-ui-react";
import { formatBrazilianPhoneNumber, formatCEP } from "../utils";
import { isAlpha, isMobilePhoneWithDDD, isPhoneWithDDD } from "../validation";
import { toast } from "react-toastify";
import Axios from "axios";
import config from "../../config";
import DatePicker from "react-datepicker";
import FormSubTitle from "../Common/FormSubTitle";
import FormTitle from "../Common/FormTitle";
import moment from "moment";
import Notification from "../Notification/Notification";
import React, { Component } from "react";
import Spinner from "react-spinkit";
import styled from "styled-components";
import ValidationError from "../Common/ValidationError";
import validator from "validator";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */
const Avatar = styled(Image)`
  margin: 0 0px 15px 0;
`;
/* ============================================================================ */
const errorsTemplate = {
  basic: [],
  contact: [],
  address: [],
  employee: [],
  newEmployee: []
};

const userTemplate = {
  firstName: "",
  lastName: "",
  avatar:
    "https://res.cloudinary.com/bukkapp/image/upload/v1547558890/Bukk/Assets/User/Avatars/user.png",
  gender: "",
  birthday: new Date(1970, 0, 1),
  email: "",
  phone: "",
  address: {
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    postalCode: ""
  },
  employee: {
    title: "",
    salary: "",
    salesCommission: ""
  }
};

export class NewEdit extends Component {
  state = {
    loading: false,
    errors: errorsTemplate,
    user: userTemplate,
    states: [],
    cities: [],
    newUserModal: {
      display: false,
      user: "Rafael Fagundes",
      email: "rafaelcflima@gmail.com",
      password: "%$RTG$YF$R"
    }
  };

  loadStates = () => {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.get(config.api + "/utils/getstates", {}, requestConfig)
      .then(response => {
        let _options = response.data.states.map(state => {
          return { key: state.abbr, value: state.name, text: state.name };
        });

        this.setState({ states: _options });
      })
      .catch(error => {
        console.log(error);
      });
  };

  loadCities = state => {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.get(
      config.api + "/utils/getcities",
      { params: { state } },
      requestConfig
    )
      .then(response => {
        let _options = response.data.cities.map(city => {
          return { key: city, value: city, text: city };
        });

        this.setState({ cities: _options });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.loadStates();
    this.loadCities("Acre");
    if (this.props.edit) {
      if (this.props.user) {
        this.setState({ user: this.props.user });
      } else if (this.props.match) {
        if (this.props.match.params.option === "editar") {
          const { id } = this.props.match.params;

          const token = localStorage.getItem("token");
          let requestConfig = {
            headers: {
              Authorization: token
            }
          };

          Axios.post(
            config.api + "/specialists/user/get",
            { id },
            requestConfig
          )
            .then(response => {
              this.setState({ user: response.data });
            })
            .catch(error => {
              toast(
                <Notification
                  type="error"
                  title="Erro ao buscar funcionário"
                  text="Não foi possível atualizar o buscar funcionário"
                />
              );
            });
        }
      }
    }
  }

  validate = () => {
    let _errors = JSON.parse(JSON.stringify(errorsTemplate));

    const _user = this.state.user;

    if (validator.isEmpty("" + _user.firstName)) {
      _errors.basic.push({ error: true, msg: "Por favor, preencha o nome." });
    }
    if (validator.isEmpty("" + _user.lastName)) {
      _errors.basic.push({
        error: true,
        msg: "Por favor, preencha o sobrenome."
      });
    }
    if (_user.birthday) {
      if (_user.birthday.toString() === "Invalid Date") {
        _errors.basic.push({
          error: true,
          msg: "Por favor, preencha o aniversário."
        });
      }
    }
    if (validator.isEmpty("" + _user.email)) {
      _errors.contact.push({
        error: true,
        msg: "Por favor, preencha o email."
      });
    }
    if (validator.isEmpty("" + _user.phone)) {
      _errors.contact.push({
        error: true,
        msg: "Por favor, preencha o telefone."
      });
    }
    if (validator.isEmpty("" + _user.address.street)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha o logradouro."
      });
    }
    if (validator.isEmpty("" + _user.address.number)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha o número."
      });
    }
    if (validator.isEmpty("" + _user.address.neighborhood)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha o bairro."
      });
    }
    if (validator.isEmpty("" + _user.address.city)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha a cidade."
      });
    }
    if (validator.isEmpty("" + _user.address.postalCode)) {
      _errors.address.push({ error: true, msg: "Por favor, preencha o CEP." });
    }

    if (validator.isEmpty("" + _user.employee.title)) {
      _errors.employee.push({
        error: true,
        msg: "Por favor, preencha a função."
      });
    }
    if (
      _user.employee.salary === "NaN" ||
      validator.isEmpty("" + _user.employee.salary)
    ) {
      _errors.employee.push({
        error: true,
        msg: "Por favor, preencha o salário."
      });
    }
    if (validator.isEmpty("" + _user.employee.salesCommission)) {
      _errors.employee.push({
        error: true,
        msg: "Por favor, preencha a comissão."
      });
    }

    if (!validator.isEmpty("" + _user.firstName) && !isAlpha(_user.firstName)) {
      _errors.basic.push({
        error: true,
        msg: "Por favor preencha o nome somente com letras."
      });
    }
    if (validator.isEmpty("" + _user.lastName) && !isAlpha(_user.lastName)) {
      _errors.basic.push({
        error: true,
        msg: "Por favor preencha o sobrenome somente com letras."
      });
    }
    if (!validator.isEmail(_user.email)) {
      _errors.contact.push({
        error: true,
        msg: "O email é inválido. Por favor, confira o email informado."
      });
    }
    if (!isMobilePhoneWithDDD(_user.phone) && !isPhoneWithDDD(_user.phone)) {
      _errors.contact.push({
        error: true,
        msg:
          "O telefone é inválido. Por favor, confira o telefone informado. Ex: (32) 91234-5678."
      });
    }

    if (_user.address.postalCode.replace("-", "").length !== 8) {
      _errors.address.push({
        error: true,
        msg: "O CEP é inválido. Deve conter 8 algarismos."
      });
    }

    let countErrors = 0;
    for (let key in _errors) {
      countErrors += _errors[key].length;
    }

    if (countErrors) {
      this.setState({ errors: _errors });
      return false;
    } else {
      return true;
    }
  };

  save = () => {
    if (!this.validate()) {
      return false;
    }

    const _user = JSON.parse(JSON.stringify(this.state.user));
    delete _user.employee;
    const _employee = JSON.parse(JSON.stringify(this.state.user.employee));

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };
    if (this.props.edit) {
      Axios.patch(
        config.api + "/specialists/updateUserEmployee",
        { user: _user, employee: _employee },
        requestConfig
      )
        .then(response => {
          console.log(response.data);
          toast(
            <Notification
              type="success"
              title="Funcionário atualizado"
              text="Os dados foram atualizados com sucesso"
            />
          );
        })
        .catch(error => {
          console.log(error);
          toast(
            <Notification
              type="error"
              title="Erro ao atualizar funcionário"
              text="Erro ao tentar atualizar o funcionário"
            />
          );
        });
    } else {
      Axios.post(
        config.api + "/specialists/add",
        { user: _user, employee: _employee },
        requestConfig
      )
        .then(response => {
          const { user, password } = response.data;

          let newUserModal = {
            display: true,
            user: `${user.firstName} ${user.lastName}`,
            email: user.email,
            password
          };

          this.setState({ newUserModal });

          toast(
            <Notification
              type="success"
              title="Funcionário criado"
              text="O funcionário foi criado com sucesso."
            />
          );
        })
        .catch(error => {
          console.log(error);
          toast(
            <Notification
              type="error"
              title="Erro ao criar funcionário"
              text="Erro ao tentar criar o funcionário"
            />
          );
        });
    }
  };

  handleChange = (e, { id, value }) => {
    if (id === undefined && value === undefined) {
      id = e.currentTarget.id;
      value = e.currentTarget.value;
    }

    let _user = undefined;
    if (id.indexOf("-") >= 0) {
      let keys = id.split("-");
      _user = {
        ...this.state.user,
        [keys[0]]: {
          ...this.state.user[keys[0]],
          [keys[1]]: value
        }
      };
    } else {
      _user = {
        ...this.state.user,
        [id]: value
      };
    }

    this.setState({
      user: _user
    });
  };

  handleBirthdayChange = date => {
    this.setState({
      user: {
        ...this.state.user,
        birthday: date
      }
    });
  };

  handleStateChange = (e, { id, value }) => {
    console.log("loading cities");
    this.setState({
      user: {
        ...this.state.user,
        address: {
          ...this.state.user.address,
          state: value
        }
      }
    });
    this.loadCities(value);
  };

  handleRemoveAvatar = () => {
    const defaultAvatar =
      "https://res.cloudinary.com/bukkapp/image/upload/v1547558890/Bukk/Assets/User/Avatars/user.png";

    this.setState({
      user: {
        ...this.state.user,
        avatar: defaultAvatar
      }
    });
  };

  handleNewUserModalClose = () => {
    this.setState({
      user: userTemplate,
      newUserModal: {
        ...this.state.newUserModal,
        display: false
      }
    });
  };

  render() {
    return (
      <>
        <Modal
          open={this.state.newUserModal.display}
          onClose={this.handleNewUserModalClose}
          size="tiny"
        >
          <Header icon="user outline" content="Novo Usuário" />
          <Modal.Content>
            <h3>
              O usuário {this.state.newUserModal.user} foi criado com sucesso.
            </h3>
            <p>
              Os dados de acesso também foram enviados para o email do usuário:{" "}
              <strong>{this.state.newUserModal.email}</strong>
            </p>
            <h4>Dados de acesso:</h4>
            <p>
              Email: <strong>{this.state.newUserModal.email}</strong>
              <br />
              Senha: <strong>{this.state.newUserModal.password}</strong>
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.handleNewUserModalClose}>
              <Icon name="checkmark" /> OK
            </Button>
          </Modal.Actions>
        </Modal>
        <Form>
          {this.props.edit && (
            <>
              <FormTitle
                first
                text={
                  this.state.user.firstName + " " + this.state.user.lastName
                }
              />
              <FormSubTitle text="Foto do Funcionário" />
              <Avatar
                src={this.state.user.avatar}
                size="small"
                rounded
                className="company-config-edit-avatar"
              />

              <Button
                icon
                labelPosition="left"
                onClick={this.handleRemoveAvatar}
              >
                <Icon name="delete" />
                Remover Foto
              </Button>
            </>
          )}
          <FormSubTitle text="Informações Básicas" first={!this.props.edit} />
          <Form.Group>
            <Form.Input
              value={this.state.user.firstName}
              fluid
              label="Nome"
              placeholder="Nome"
              width={6}
              id="firstName"
              onChange={this.handleChange}
              required
            />
            <Form.Input
              value={this.state.user.lastName}
              fluid
              label="Sobrenome"
              placeholder="Sobrenome"
              width={6}
              id="lastName"
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Select
              fluid
              label="Sexo"
              options={[
                { key: "F", text: "Feminino", value: "F" },
                { key: "M", text: "Masculino", value: "M" },
                { key: "O", text: "Outro", value: "O" }
              ]}
              placeholder="Sexo"
              value={this.state.user.gender}
              width={3}
              id="gender"
              onChange={this.handleChange}
              required
            />
            <Form.Field>
              <label>Data de Nascimento</label>
              <DatePicker
                selected={moment(this.state.user.birthday).toDate()}
                onChange={this.handleBirthdayChange}
                locale="pt-BR"
                showYearDropdown
                dateFormatCalendar="MMMM"
                scrollableYearDropdown
                yearDropdownItemNumber={75}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                id="birthday"
              />
            </Form.Field>
          </Form.Group>
          {this.state.errors.basic.map((error, index) => (
            <ValidationError key={index} show={error.error} error={error.msg} />
          ))}
          <FormSubTitle text="Contato" />
          <Form.Group>
            <Form.Input
              value={this.state.user.email}
              fluid
              label="Email"
              placeholder="Email"
              width={6}
              id="email"
              onChange={this.handleChange}
              required
            />
            <Form.Input
              value={
                this.state.user.phone
                  ? formatBrazilianPhoneNumber(this.state.user.phone)
                  : ""
              }
              fluid
              label="Telefone"
              placeholder="Telefone"
              width={3}
              id="phone"
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          {this.state.errors.contact.map((error, index) => (
            <ValidationError key={index} show={error.error} error={error.msg} />
          ))}
          <FormSubTitle text="Endereço" />
          <Form.Group>
            <Form.Input
              value={
                this.state.user.address ? this.state.user.address.street : ""
              }
              fluid
              label="Logradouro"
              placeholder="Logradouro"
              width={12}
              id="address-street"
              onChange={this.handleChange}
              required
            />
            <Form.Input
              value={
                this.state.user.address ? this.state.user.address.number : ""
              }
              fluid
              label="Número"
              placeholder="Número"
              width={2}
              id="address-number"
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              value={
                this.state.user.address
                  ? this.state.user.address.neighborhood
                  : ""
              }
              fluid
              label="Bairro"
              placeholder="Bairro"
              width={12}
              id="address-neighborhood"
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Select
              fluid
              label="Estado"
              options={this.state.states}
              placeholder="Estado"
              value={
                this.state.user.address ? this.state.user.address.state : ""
              }
              width={4}
              id="address-state"
              onChange={this.handleStateChange}
              required
              search
            />
            <Form.Select
              fluid
              label="Cidade"
              options={this.state.cities}
              placeholder="Cidade"
              value={
                this.state.user.address ? this.state.user.address.city : ""
              }
              width={4}
              id="address-city"
              onChange={this.handleChange}
              required
              search
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              value={
                this.state.user.address
                  ? formatCEP(this.state.user.address.postalCode)
                  : ""
              }
              fluid
              label="CEP"
              placeholder="CEP"
              width={2}
              id="address-postalCode"
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          {this.state.errors.address.map((error, index) => (
            <ValidationError key={index} show={error.error} error={error.msg} />
          ))}
          <FormSubTitle text="Sobre o Funcionário" />
          <Form.Group>
            <Form.Input
              value={this.state.user.employee.title}
              fluid
              label="Função / Cargo / Especialidade"
              placeholder="Função / Cargo / Especialidade"
              width={12}
              onChange={this.handleChange}
              required
              id="employee-title"
            />
          </Form.Group>

          <Form.Group>
            <Form.Input
              value={this.state.user.employee.salary}
              fluid
              label="Salário"
              placeholder="Salário"
              width={2}
              onChange={this.handleChange}
              required
              id="employee-salary"
              onBlur={this.formatCurrencyOnBlur}
            />
            <Form.Input
              value={this.state.user.employee.salesCommission}
              fluid
              label="Comissão (%)"
              placeholder="(%)"
              width={2}
              onChange={this.handleChange}
              required
              id="employee-salesCommission"
            />
          </Form.Group>
          {this.state.errors.employee.map((error, index) => (
            <ValidationError key={index} show={error.error} error={error.msg} />
          ))}
        </Form>
        <Divider style={{ marginTop: "40px" }} />
        <Button icon labelPosition="left" color="green" onClick={this.save}>
          <Icon name="cloud" />
          Salvar
        </Button>
        {this.state.loading && (
          <Spinner
            style={{ top: "6px", left: "5px", display: "inline-block" }}
            name="circle"
            color={this.props.company.settings.colors.primaryBack}
          />
        )}
        <Button
          floated="right"
          icon
          labelPosition="left"
          onClick={() => {
            this.props.setPage("lista");
            this.props.history.push(`/dashboard/funcionarios/lista`);
          }}
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
