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
  Form,
  Confirm
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
  employee: [],
  newEmployee: []
};

export class Staff extends Component {
  state = {
    editClicked: false,
    removeClicked: false,
    addClicked: false,
    loading: false,
    currentEmployeeIndex: 0,
    confirmRemoveToggle: false,
    employees: [],
    errors: errorsTemplate,
    newEmployee: {
      firstName: "",
      lastName: "",
      email: ""
    }
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

  updateEmployees = addUser => {
    const _company = JSON.parse(localStorage.getItem("company"));
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };
    Axios.post(
      config.api + "/specialists/company",
      { companyId: _company._id },
      requestConfig
    )
      .then(response => {
        this.setState({
          employees: response.data,
          editClicked: addUser ? true : false,
          currentEmployeeIndex: addUser ? this.state.employees.length : 0
        });
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
  };

  handleEditEmployee = e => {
    const _index = Number(e.currentTarget.id.replace("edit-", ""));

    this.setState({
      currentEmployeeIndex: _index,
      editClicked: true,
      removeClicked: false
    });
  };

  handleRemoveAvatar = () => {
    let _employees = JSON.parse(JSON.stringify(this.state.employees));

    _employees[this.state.currentEmployeeIndex].avatar =
      "https://res.cloudinary.com/bukkapp/image/upload/v1547558890/Bukk/Assets/User/Avatars/user.png";

    this.setState({ employees: _employees });
  };

  callEmployeeAvailability = (index, value) => {
    if (!this.validateEmployee()) {
      toast(
        <Notification
          type="error"
          title="Não foi possível habilitar o usuário"
          text="Usuário está com cadastro incompleto"
        />
      );

      return false;
    }
    this.setState({ loading: true });

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    const _employees = [...this.state.employees];
    _employees[index].employee.enabled = value;

    Axios.patch(
      config.api + "/specialists/availability",
      { _id: _employees[index].employee._id, enabled: value },
      requestConfig
    )
      .then(response => {
        this.setState({
          employees: _employees,
          editClicked: false,
          removeClicked: false,
          loading: false
        });
        localStorage.setItem("staff", JSON.stringify(_employees));
        toast(
          <Notification
            type="success"
            title={value ? "Funcionário ativado" : "Funcionário desativado"}
            text="Alterações na visibilidade do funcionário concluídas com sucesso"
          />
        );
      })
      .catch(error => {
        this.setState({ loading: false });
        toast(
          <Notification
            type="error"
            title="Erro ao ativar ou desativar funcionário"
            text="Alterações na visibilidade do funcionário falharam"
          />
        );
      });
  };

  handleEmployeeAvailabilityCkb = e => {
    const _index = e.currentTarget.id.replace("display-", "");
    const _value = e.currentTarget.checked;
    this.setState({ currentEmployeeIndex: _index }, () => {
      this.callEmployeeAvailability(_index, _value);
    });
  };

  handleEmployeeAvailabilityBtn = e => {
    const _employees = [...this.state.employees];
    const _index = this.state.currentEmployeeIndex;
    const _value = !_employees[_index].employee.enabled;
    this.setState({ currentEmployeeIndex: _index }, () => {
      this.callEmployeeAvailability(_index, _value);
    });
  };

  handleEmployeeAdd = e => {
    this.setState({
      addClicked: true
    });
  };

  confirmRemove = e => {
    this.setState({
      confirmRemoveToggle: !this.state.confirmRemoveToggle
    });
  };

  handleEmployeeRemove = e => {
    console.log("Removing employee");
    this.setState({ loading: true, confirmRemoveToggle: false });
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };
    const _employeeId = this.state.employees[this.state.currentEmployeeIndex]
      .employee._id;
    const _userId = this.state.employees[this.state.currentEmployeeIndex]._id;
    let _employees = [...this.state.employees];
    _employees.splice([this.state.currentEmployeeIndex], 1);

    Axios.post(
      config.api + "/specialists/delete",
      { employeeId: _employeeId, userId: _userId },
      requestConfig
    )
      .then(response => {
        this.setState({
          employees: _employees,
          editClicked: false,
          removeClicked: false,
          loading: false
        });
        localStorage.setItem("staff", JSON.stringify(_employees));
        toast(
          <Notification
            type="success"
            title="Funcionário removido"
            text="Funcionário removido com sucesso"
          />
        );
      })
      .catch(error => {
        this.setState({ loading: false });
        toast(
          <Notification
            type="error"
            title="Erro ao remover funcionário"
            text="Não foi possível remover o funcionário"
          />
        );
      });
  };
  // -
  // -
  // -
  handleEmployeeActions = e => {
    const _index = Number(e.currentTarget.id.replace("remove-", ""));

    this.setState({
      currentEmployeeIndex: _index,
      editClicked: false,
      removeClicked: true
    });
  };

  handleCancelEdit = () => {
    this.setState({
      editClicked: false,
      removeClicked: false,
      addClicked: false
    });
    this.updateEmployees(false);
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

  handleNewEmployeeChange = e => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;

    this.setState({
      newEmployee: {
        ...this.state.newEmployee,
        [id]: value
      }
    });
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

    if (validator.isEmpty("" + _employee.firstName)) {
      _errors.basic.push({ error: true, msg: "Por favor, preencha o nome." });
    }
    if (validator.isEmpty("" + _employee.lastName)) {
      _errors.basic.push({
        error: true,
        msg: "Por favor, preencha o sobrenome."
      });
    }
    if (_employee.birthday) {
      if (_employee.birthday.toString() === "Invalid Date") {
        _errors.basic.push({
          error: true,
          msg: "Por favor, preencha o aniversário."
        });
      }
    }
    if (validator.isEmpty("" + _employee.email)) {
      _errors.contact.push({
        error: true,
        msg: "Por favor, preencha o email."
      });
    }
    if (validator.isEmpty("" + _employee.phone)) {
      _errors.contact.push({
        error: true,
        msg: "Por favor, preencha o telefone."
      });
    }
    if (validator.isEmpty("" + _employee.address.street)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha o logradouro."
      });
    }
    if (validator.isEmpty("" + _employee.address.number)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha o número."
      });
    }
    if (validator.isEmpty("" + _employee.address.neighborhood)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha o bairro."
      });
    }
    if (validator.isEmpty("" + _employee.address.city)) {
      _errors.address.push({
        error: true,
        msg: "Por favor, preencha a cidade."
      });
    }
    if (validator.isEmpty("" + _employee.address.postalCode)) {
      _errors.address.push({ error: true, msg: "Por favor, preencha o CEP." });
    }

    if (validator.isEmpty("" + _employee.employee.title)) {
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
    if (validator.isEmpty("" + _employee.employee.salesCommission)) {
      _errors.employee.push({
        error: true,
        msg: "Por favor, preencha a comissão."
      });
    }

    if (
      !validator.isEmpty("" + _employee.firstName) &&
      !isAlpha(_employee.firstName)
    ) {
      _errors.basic.push({
        error: true,
        msg: "Por favor preencha o nome somente com letras."
      });
    }
    if (
      validator.isEmpty("" + _employee.lastName) &&
      !isAlpha(_employee.lastName)
    ) {
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

  addEmployee = () => {
    let _errors = JSON.parse(JSON.stringify(errorsTemplate));
    this.setState({ loading: true, errors: _errors });

    if (validator.isEmpty(this.state.newEmployee.firstName + "")) {
      _errors.newEmployee.push({
        error: true,
        msg: "Por favor, preencha o nome."
      });
    }
    if (validator.isEmpty(this.state.newEmployee.lastName + "")) {
      _errors.newEmployee.push({
        error: true,
        msg: "Por favor, preencha o sobrenome."
      });
    }
    if (validator.isEmpty(this.state.newEmployee.email + "")) {
      _errors.newEmployee.push({
        error: true,
        msg: "Por favor, preencha o email."
      });
    }

    if (
      !validator.isEmpty(this.state.newEmployee.firstName + "") &&
      !isAlpha(this.state.newEmployee.firstName)
    ) {
      _errors.newEmployee.push({
        error: true,
        msg: "O nome é inválido."
      });
    }

    if (
      !validator.isEmpty(this.state.newEmployee.lastName + "") &&
      !isAlpha(this.state.newEmployee.lastName)
    ) {
      _errors.newEmployee.push({
        error: true,
        msg: "O sobrenome é inválido."
      });
    }

    if (
      !validator.isEmpty(this.state.newEmployee.firstName + "") &&
      !validator.isEmail(this.state.newEmployee.email)
    ) {
      _errors.newEmployee.push({
        error: true,
        msg: "O email é inválido."
      });
    }

    let countErrors = 0;
    for (let key in _errors) {
      countErrors += _errors[key].length;
    }

    if (countErrors) {
      this.setState({ errors: _errors, loading: false });
      return false;
    }
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/users/adduser",
      this.state.newEmployee,
      requestConfig
    )
      .then(response => {
        toast(
          <Notification
            type="success"
            title="Funcionário adicionado com sucesso"
            text="As informações para o término do cadastro foram enviados para o novo funcionário"
          />
        );
        this.setState({
          loading: false,
          addClicked: false
        });
        this.updateEmployees(true);
      })
      .catch(error => {
        if (error.response.data.msg) {
          toast(
            <Notification
              type="error"
              title="Erro ao adicionar novo funcionário"
              text={error.response.data.msg}
            />
          );

          const _errors = JSON.parse(JSON.stringify(this.state.errors));
          _errors.newEmployee.push({
            msg: "Já existe um usuário com este email.",
            error: true
          });

          this.setState({ errors: _errors });
        } else {
          toast(
            <Notification
              type="error"
              title="Erro ao adicionar novo funcionário"
              text="Não foi possível adicionar o funcionário. Contate o suporte."
            />
          );
        }
        this.setState({ loading: false });
      });
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
        this.setState({ editClicked: false });
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
        {!this.state.editClicked &&
          !this.state.removeClicked &&
          !this.state.addClicked && (
            <>
              <FormTitle text="Funcionários" first />
              <Table celled padded>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Ativo?</Table.HeaderCell>
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
                          onChange={this.handleEmployeeAvailabilityCkb}
                          id={"display-" + index}
                          disabled={this.state.loading}
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
                        {employee.phone
                          ? formatBrazilianPhoneNumber(employee.phone)
                          : "-"}
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
                          onClick={this.handleEmployeeActions}
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

              <Button
                color="green"
                icon
                labelPosition="left"
                onClick={this.handleEmployeeAdd}
              >
                <Icon name="plus" />
                Adicionar Funcionário
              </Button>
            </>
          )}
        {/* ===========================================================
          Add new employee
        =========================================================== */}
        {this.state.addClicked && (
          <>
            <FormTitle text="Adicionar Funcionário" first />
            <Form>
              <Form.Group>
                <Form.Input
                  label="Nome"
                  width="6"
                  required
                  fluid
                  placeholder="Nome"
                  value={this.state.newEmployee.firstName}
                  onChange={this.handleNewEmployeeChange}
                  id="firstName"
                />
                <Form.Input
                  label="Sobrenome"
                  width="6"
                  required
                  fluid
                  placeholder="Sobrenome"
                  value={this.state.newEmployee.lastName}
                  onChange={this.handleNewEmployeeChange}
                  id="lastName"
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  label="Email"
                  width="6"
                  required
                  fluid
                  placeholder="Email"
                  value={this.state.newEmployee.email}
                  onChange={this.handleNewEmployeeChange}
                  id="email"
                />
              </Form.Group>
            </Form>
            {this.state.errors.newEmployee.map((error, index) => (
              <ValidationError
                key={index}
                show={error.error}
                error={error.msg}
              />
            ))}
            <div className="add-new-employee-info">
              <h3 className="add-new-employee-info-title">Observações:</h3>
              <p className="add-new-employee-info-text">
                O novo funcionário receberá por email as instruções de como
                acessar o sistema.
              </p>
              <p className="add-new-employee-info-text">
                Ao acessar o sistema pela primeira vez, o funcionário deverá
                alterar a senha gerada automaticamente.
              </p>
              <p className="add-new-employee-info-text">
                O novo funcionário só poderá ser habilitado após preenchido
                todos os campos obrigatórios.
              </p>
              <p className="add-new-employee-info-text">
                Após clicar em adicionar, você será redirecionado para a tela de
                conclusão de cadastro.
              </p>
            </div>
            <Divider style={{ marginTop: "40px" }} />
            <Button
              icon
              labelPosition="left"
              color="green"
              onClick={this.addEmployee}
              disabled={this.state.loading}
            >
              <Icon name="plus" />
              Adicionar
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
              onClick={this.handleCancelEdit}
            >
              <Icon name="delete" />
              Cancelar
            </Button>
          </>
        )}

        {/* ===========================================================
          Remove or disable employee
        =========================================================== */}
        {this.state.removeClicked && (
          <>
            <FormTitle text="Controle de Funcionário" first />
            <>
              <Button
                color="blue"
                icon="power"
                content={_employee.employee.enabled ? "Desativar" : "Ativar"}
                onClick={this.handleEmployeeAvailabilityBtn}
                disabled={this.state.loading}
              />
              <Information
                show
                text="Você pode desativar temporariamente um funcionário. Não se preocupe, nenhum dado será apagado."
              />
              <br />
            </>
            <Button
              color="red"
              icon="delete"
              content="Remover"
              negative
              onClick={this.confirmRemove}
              disabled={this.state.loading}
            />
            <Confirm
              open={this.state.confirmRemoveToggle}
              onCancel={this.confirmRemove}
              onConfirm={this.handleEmployeeRemove}
              header="Tem certeza que deseja remover o funcionário?"
              content="Essa ação é irreversível. Opte por desativar caso queira somente não exibir o funcionário nas telas de agendamento."
              cancelButton="Cancelar"
              confirmButton="Sim, desejo remover o funcionário"
            />
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
            <Button
              floated="right"
              onClick={this.handleCancelEdit}
              icon
              labelPosition="left"
            >
              <Icon name="delete" />
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
              <FormSubTitle text="Foto do Funcionário" />
              <Image
                src={_employee.avatar}
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
                    { key: "M", text: "Masculino", value: "M" },
                    { key: "O", text: "Outro", value: "O" }
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
                  value={
                    _employee.phone
                      ? formatBrazilianPhoneNumber(_employee.phone)
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
                <ValidationError
                  key={index}
                  show={error.error}
                  error={error.msg}
                />
              ))}
              <FormSubTitle text="Endereço" />
              <Form.Group>
                <Form.Input
                  value={_employee.address ? _employee.address.street : ""}
                  fluid
                  label="Logradouro"
                  placeholder="Logradouro"
                  width={12}
                  id="address-street"
                  onChange={this.handleChange}
                  required
                />
                <Form.Input
                  value={_employee.address ? _employee.address.number : ""}
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
                    _employee.address ? _employee.address.neighborhood : ""
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
                <Form.Input
                  value={_employee.address ? _employee.address.city : ""}
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
                  value={_employee.address ? _employee.address.state : ""}
                  width={4}
                  id="address-state"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  value={
                    _employee.address
                      ? formatCEP(_employee.address.postalCode)
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
            <Button
              floated="right"
              onClick={this.handleCancelEdit}
              icon
              labelPosition="left"
            >
              <Icon name="delete" />
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
