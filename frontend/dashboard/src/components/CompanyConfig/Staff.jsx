import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "react-spinkit";
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
import {
  formatBrazilianPhoneNumber,
  formatCEP,
  formatCurrency
} from "../utils";
import { states } from "../../config/BrasilAddress";
import Information from "../Common/Information";

export class Staff extends Component {
  state = {
    editClicked: false,
    removeClicked: false,
    loading: false,
    currentEmployeeIndex: 0,
    employees: []
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
    console.log(e.currentTarget.id);
    const _index = Number(e.currentTarget.id.replace("edit-", ""));

    this.setState({
      currentEmployeeIndex: _index,
      editClicked: true,
      removeClicked: false
    });
  };

  handleRemoveEmployee = e => {
    console.log(e.currentTarget.id);
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
                />
                <Form.Input
                  value={_employee.lastName}
                  fluid
                  label="Sobrenome"
                  placeholder="Sobrenome"
                  width={6}
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
                />
                <Form.Input
                  value={moment(_employee.birthday).format("DD/MM/YYYY")}
                  fluid
                  label="Aniversário"
                  placeholder="Aniversário"
                  width={3}
                />
              </Form.Group>
              <FormSubTitle text="Contato" />
              <Form.Group>
                <Form.Input
                  value={_employee.email}
                  fluid
                  label="Email"
                  placeholder="Email"
                  width={6}
                />
                <Form.Input
                  value={formatBrazilianPhoneNumber(_employee.phone)}
                  fluid
                  label="Telefone"
                  placeholder="Telefone"
                  width={3}
                />
              </Form.Group>
              <FormSubTitle text="Endereço" />
              <Form.Group>
                <Form.Input
                  value={_employee.address.street}
                  fluid
                  label="Rua"
                  placeholder="Rua"
                  width={12}
                />
                <Form.Input
                  value={_employee.address.number}
                  fluid
                  label="Número"
                  placeholder="Número"
                  width={2}
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  value={_employee.address.neighborhood}
                  fluid
                  label="Bairro"
                  placeholder="Bairro"
                  width={12}
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  value={_employee.address.city}
                  fluid
                  label="Cidade"
                  placeholder="Cidade"
                  width={8}
                />
                <Form.Select
                  fluid
                  label="Estado"
                  options={states}
                  placeholder="Estado"
                  value={_employee.address.state}
                  width={4}
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  value={formatCEP(_employee.address.postalCode)}
                  fluid
                  label="CEP"
                  placeholder="CEP"
                  width={2}
                />
              </Form.Group>
              <FormSubTitle text="Sobre o Funcionário" />
              <Form.Group>
                <Form.Input
                  value={_employee.employee.title}
                  fluid
                  label="Função / Cargo / Especialidade"
                  placeholder="Função / Cargo / Especialidade"
                  width={12}
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  value={formatCurrency(_employee.employee.salary)}
                  fluid
                  label="Salário"
                  placeholder="Salário"
                  width={4}
                />
                <Form.Input
                  value={_employee.employee.salesCommission}
                  fluid
                  label="Comissão (%)"
                  placeholder="(%)"
                  width={2}
                />
              </Form.Group>
            </Form>
            <Divider style={{ marginTop: "40px" }} />
            <Button
              icon
              labelPosition="left"
              color="green"
              onClick={this.saveServices}
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
