import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "react-spinkit";
import MaskedInput from "react-text-mask";
import FormTitle from "../Common/FormTitle";
import FormSubTitle from "../Common/FormSubTitle";
import Axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import Notification from "../Notification/Notification";
import moment from "moment";
import {
  Table,
  Button,
  Icon,
  Image,
  Checkbox,
  Divider,
  Form
} from "semantic-ui-react";
import { formatBrazilianPhoneNumber, formatCEP } from "../utils";
import { states } from "../../config/BrasilAddress";
import Information from "../Common/Information";
import ValidationError from "../Common/ValidationError";
import validator from "validator";
import { isAlpha, isMobilePhoneWithDDD, isPhoneWithDDD } from "../validation";

const errorsTemplate = {
  basic: [],
  contact: [],
  address: [],
  employee: []
};

export class Staff extends Component {
  state = {
    editClicked: true,
    removeClicked: false,
    loading: false,
    currentEmployeeIndex: 0,
    employees: [],
    errors: errorsTemplate
  };

  componentDidMount() {
    const _company = JSON.parse(localStorage.getItem("company"));
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    if (localStorage.getItem("staff")) {
      this.setState({ employees: JSON.parse(localStorage.getItem("staff")) });
    } else {
      Axios.post(
        config.api + "/specialists/company",
        { companyId: _company._id },
        requestConfig
      )
        .then(response => {
          this.setState({ employees: response.data });
          localStorage.setItem("staff", JSON.stringify(response.data));
        })
        .catch(err => {
          toast(
            <Notification
              type="error"
              title="Erro ao carregar os serviços da empresa"
              text={err.response.data.msg}
            />
          );
        });
    }
  }

  handleEditEmployee = e => {
    const _index = Number(e.currentTarget.id.replace("edit-", ""));

    this.setState({
      currentEmployeeIndex: _index,
      editClicked: true,
      removeClicked: false
    });
  };

  handleRemoveEmployee = e => {
    const _index = Number(e.currentTarget.id.replace("remove-", ""));

    this.setState({
      currentEmployeeIndex: _index,
      editClicked: false,
      removeClicked: true
    });
  };

  handleCancelEdit = () => {
    this.setState({ editClicked: false, removeClicked: false });
  };

  formatCurrency = value => {
    return String(value)
      .replace(/[^\d.,-]/g, "")
      .replace(".", ",");
  };

  formatCurrencyOnBlur = e => {
    const _value = parseFloat(e.currentTarget.value.replace(",", ".")).toFixed(
      2
    );

    const _index = this.state.currentEmployeeIndex;
    const [_key, _key2] = e.currentTarget.id.split("-");
    let _employees = [...this.state.employees];

    _employees[_index][_key][_key2] = parseFloat(_value).toFixed(2);

    this.setState({
      employees: _employees
    });
  };

  handleChange = (e, { id, value }) => {
    if (id === undefined && value === undefined) {
      id = e.currentTarget.id;
      value = e.currentTarget.value;
    }

    const _index = this.state.currentEmployeeIndex;
    let _employees = [...this.state.employees];

    if (id.indexOf("address-") >= 0) {
      id = id.replace("address-", "");
      _employees[_index]["address"][id] = value;
    } else if (id.indexOf("employee-") >= 0) {
      id = id.replace("employee-", "");
      _employees[_index]["employee"][id] = value;
    } else {
      _employees[_index][id] = value;
    }
    this.setState({ employees: _employees });
  };

  handleUserBirthday = e => {
    try {
      if (e.currentTarget.value.indexOf("_") < 0) {
        const birthday = moment(e.currentTarget.value, "DD/MM/YYYY");

        let _employees = this.state.employees;

        const _index = this.state.currentEmployeeIndex;
        _employees[_index]["birthday"] = birthday.toDate();
        this.setState({ employees: _employees });
      }
    } catch (error) {}
  };

  validateEmployee = () => {
    let _errors = JSON.parse(JSON.stringify(errorsTemplate));

    const _employee = this.state.employees[this.state.currentEmployeeIndex];

    if (validator.isEmpty(_employee.firstName)) {
      _errors.basic.push({ error: true, msg: "Por favor, preencha o nome." });
    }
    if (validator.isEmpty(_employee.lastName)) {
      _errors.basic.push({
        error: true,
        msg: "Por favor, preencha o sobrenome."
      });
    }
    if (_employee.birthday.toString() === "Invalid Date") {
      _errors.basic.push({
        error: true,
        msg: "Por favor, preencha o aniversário."
      });
    }
    if (validator.isEmpty(_employee.email)) {
      _errors.contact.push({
        error: true,
        msg: "Por favor, preencha o email."
      });
    }
    if (validator.isEmpty(_employee.phone)) {
      _errors.contact.push({
        error: true,
        msg: "Por favor, preencha o telefone."
      });
    }
    if (validator.isEmpty(_employee.address.street)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha o logradouro."
      });
    }
    if (validator.isEmpty(_employee.address.number)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha o número."
      });
    }
    if (validator.isEmpty(_employee.address.neighborhood)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha o bairro."
      });
    }
    if (validator.isEmpty(_employee.address.city)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha a cidade."
      });
    }
    if (validator.isEmpty(_employee.address.postalCode)) {
      _errors.address.push({ error: true, msg: "Por favor, preencha o CEP." });
    }

    if (validator.isEmpty(_employee.employee.title)) {
      _errors.employee.push({
        error: true,
        msg: "Por favor, preencha a função."
      });
    }
    if (_employee.employee.salary === "NaN") {
      _errors.employee.push({
        error: true,
        msg: "Por favor, preencha o salário."
      });
    }
    if (validator.isEmpty(_employee.employee.salesCommission)) {
      _errors.employee.push({
        error: true,
        msg: "Por favor, preencha a comissão."
      });
    }

    if (
      !validator.isEmpty(_employee.firstName) &&
      !isAlpha(_employee.firstName)
    ) {
      _errors.basic.push({
        error: true,
        msg: "Por favor preencha o nome somente com letras."
      });
    }
    if (validator.isEmpty(_employee.lastName) && !isAlpha(_employee.lastName)) {
      _errors.basic.push({
        error: true,
        msg: "Por favor preencha o sobrenome somente com letras."
      });
    }
    if (!validator.isEmail(_employee.email)) {
      _errors.contact.push({
        error: true,
        msg: "O email é inválido. Por favor, confira o email informado."
      });
    }
    if (
      !isMobilePhoneWithDDD(_employee.phone) &&
      !isPhoneWithDDD(_employee.phone)
    ) {
      _errors.contact.push({
        error: true,
        msg:
          "O telefone é inválido. Por favor, confira o telefone informado. Ex: (32) 91234-5678."
      });
    }

    if (_employee.address.postalCode.replace("-", "").length !== 8) {
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

  saveEmployee = () => {
    if (!this.validateEmployee()) {
      return false;
    }
    let _user = JSON.parse(
      JSON.stringify(this.state.employees[this.state.currentEmployeeIndex])
    );
    let _employee = _user.employee;
    _employee.salary = Number(_employee.salary);
    _employee.salesCommission = Number(_employee.salesCommission);
    delete _user.employee;
    delete _employee.workingDays;
    delete _employee.services;

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };
    Axios.patch(
      config.api + "/specialists/updateUserEmployee",
      {
        user: _user,
        employee: _employee
      },
      requestConfig
    )
      .then(response => {
        localStorage.setItem("staff", JSON.stringify(this.state.employees));
        toast(
          <Notification
            type="success"
            title="Funcionário atualizado com sucesso"
            text="As informações do funcionário foram atualizadas com sucesso"
          />
        );
      })
      .catch(err => {
        toast(
          <Notification
            type="error"
            title="Erro ao atualizar as informações do funcionário"
            text={err.response.data.msg}
          />
        );
      });
  };

  render() {
    let _employee = this.state.employees[this.state.currentEmployeeIndex];

    return (
      <div>
        {!this.state.editClicked && !this.state.removeClicked && (
          <>
            <FormTitle text="Funcionários" first />
            <Table celled padded>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Ativo</Table.HeaderCell>
                  <Table.HeaderCell>Nome</Table.HeaderCell>
                  <Table.HeaderCell>Função</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Telefone</Table.HeaderCell>
                  <Table.HeaderCell>Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.employees.map((employee, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Checkbox
                        toggle
                        checked={employee.employee.enabled}
                        onChange={this.handleEmployeeAvailability}
                        id={"display-" + index}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Image src={employee.avatar} avatar />
                      <span>
                        {employee.firstName + " " + employee.lastName}
                      </span>
                    </Table.Cell>
                    <Table.Cell>{employee.employee.title}</Table.Cell>
                    <Table.Cell>{employee.email}</Table.Cell>
                    <Table.Cell>
                      {formatBrazilianPhoneNumber(employee.phone)}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        icon
                        onClick={this.handleEditEmployee}
                        id={"edit-" + index}
                      >
                        <Icon name="edit" />
                      </Button>
                      <Button
                        icon
                        onClick={this.handleRemoveEmployee}
                        id={"remove-" + index}
                        color="red"
                      >
                        <Icon name="delete" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
        {/* ===========================================================
          Remove or disable employee
        =========================================================== */}
        {this.state.removeClicked && (
          <>
            <FormTitle text="Controle de Funcionário" first />
            {_employee.employee.enabled && (
              <>
                <Button color="blue" icon="power" content="Desativar" />
                <Information
                  show
                  text="Você pode desativar temporariamente um funcionário. Não se preocupe, nenhum dado será apagado."
                />
                <br />
              </>
            )}

            <Button color="red" icon="delete" content="Remover" negative />
            <Information
              show
              text="Removendo o funcionário, todas as informações serão apagadas."
            />
            <Divider style={{ marginTop: "40px" }} />
            {this.state.loading && (
              <Spinner
                style={{ top: "6px", left: "5px", display: "inline-block" }}
                name="circle"
                color={this.props.company.settings.colors.primaryBack}
              />
            )}
            <Button floated="right" onClick={this.handleCancelEdit}>
              Cancelar
            </Button>
          </>
        )}
        {/* ===========================================================
          Edit employee
        =========================================================== */}
        {this.state.employees.length > 0 && this.state.editClicked && (
          <>
            <Form>
              <FormTitle
                first
                text={_employee.firstName + " " + _employee.lastName}
              />
              <FormSubTitle text="Informações Básicas" />
              <Form.Group>
                <Form.Input
                  value={_employee.firstName}
                  fluid
                  label="Nome"
                  placeholder="Nome"
                  width={6}
                  id="firstName"
                  onChange={this.handleChange}
                  required
                />
                <Form.Input
                  value={_employee.lastName}
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
                    { key: "M", text: "Masculino", value: "M" }
                  ]}
                  placeholder="Sexo"
                  value={_employee.gender}
                  width={3}
                  id="gender"
                  onChange={this.handleChange}
                  required
                />
                <div className="required three wide field">
                  <label htmlFor="birthday">Data de Nascimento</label>
                  <MaskedInput
                    mask={[
                      /\d/,
                      /\d/,
                      "/",
                      /\d/,
                      /\d/,
                      "/",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/
                    ]}
                    name="birthday"
                    id="birthday"
                    onChange={this.handleUserBirthday}
                    value={
                      _employee !== undefined
                        ? moment(_employee.birthday).format("DD/MM/YYYY")
                        : ""
                    }
                  />
                </div>
              </Form.Group>
              {this.state.errors.basic.map((error, index) => (
                <ValidationError
                  key={index}
                  show={error.error}
                  error={error.msg}
                />
              ))}
              <FormSubTitle text="Contato" />
              <Form.Group>
                <Form.Input
                  value={_employee.email}
                  fluid
                  label="Email"
                  placeholder="Email"
                  width={6}
                  id="email"
                  onChange={this.handleChange}
                  required
                />
                <Form.Input
                  value={formatBrazilianPhoneNumber(_employee.phone)}
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
                <ValidationError
                  key={index}
                  show={error.error}
                  error={error.msg}
                />
              ))}
              <FormSubTitle text="Endereço" />
              <Form.Group>
                <Form.Input
                  value={_employee.address.street}
                  fluid
                  label="Logradouro"
                  placeholder="Logradouro"
                  width={12}
                  id="address-street"
                  onChange={this.handleChange}
                  required
                />
                <Form.Input
                  value={_employee.address.number}
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
                  value={_employee.address.neighborhood}
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
                <Form.Input
                  value={_employee.address.city}
                  fluid
                  label="Cidade"
                  placeholder="Cidade"
                  width={8}
                  id="address-city"
                  onChange={this.handleChange}
                  required
                />
                <Form.Select
                  fluid
                  label="Estado"
                  options={states}
                  placeholder="Estado"
                  value={_employee.address.state}
                  width={4}
                  id="address-state"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  value={formatCEP(_employee.address.postalCode)}
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
                <ValidationError
                  key={index}
                  show={error.error}
                  error={error.msg}
                />
              ))}
              <FormSubTitle text="Sobre o Funcionário" />
              <Form.Group>
                <Form.Input
                  value={_employee.employee.title}
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
                  value={this.formatCurrency(_employee.employee.salary)}
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
                  value={_employee.employee.salesCommission}
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
                <ValidationError
                  key={index}
                  show={error.error}
                  error={error.msg}
                />
              ))}
            </Form>
            <Divider style={{ marginTop: "40px" }} />
            <Button
              icon
              labelPosition="left"
              color="green"
              onClick={this.saveEmployee}
            >
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
            <Button floated="right" onClick={this.handleCancelEdit}>
              Cancelar
            </Button>
          </>
        )}
        {/* <pre>
          {JSON.stringify(
            this.state.employees[this.state.currentEmployeeIndex],
            null,
            2
          )}
        </pre> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    company: state.dashboard.company
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Staff);
