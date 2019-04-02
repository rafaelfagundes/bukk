import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import Notification from "../Notification/Notification";
import { Table, Button, Icon, Image, Checkbox } from "semantic-ui-react";
import { formatBrazilianPhoneNumber } from "../utils";

export class List extends Component {
  state = {
    employees: []
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    const { _id: companyId } = JSON.parse(localStorage.getItem("company"));

    Axios.post(
      config.api + "/specialists/company",
      { companyId },
      requestConfig
    )
      .then(response => {
        this.setState({ employees: response.data });
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

  handleEmployeeStatus = (value, id) => {
    function updateStatus(employee) {
      const token = localStorage.getItem("token");
      let requestConfig = {
        headers: {
          Authorization: token
        }
      };

      Axios.patch(
        config.api + "/specialists/update/status",
        { employee },
        requestConfig
      )
        .then(() => {
          toast(
            <Notification
              type="success"
              title="Status atualizado"
              text="O status foi atualizado com sucesso"
            />
          );
        })
        .catch(err => {
          toast(
            <Notification
              type="error"
              title="Erro ao atualizar status"
              text="Não foi possível atualizar o status do funcionário"
            />
          );
        });
    }

    const _employees = JSON.parse(JSON.stringify(this.state.employees));
    _employees[id].employee.enabled = value;
    this.setState({ employees: _employees }, () => {
      updateStatus(_employees[id].employee);
    });
  };

  render() {
    return (
      <>
        <Table fixed striped singleLine compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>Status</Table.HeaderCell>
              <Table.HeaderCell width={3}>Nome</Table.HeaderCell>
              <Table.HeaderCell width={4}>Função</Table.HeaderCell>
              <Table.HeaderCell width={3}>Email</Table.HeaderCell>
              <Table.HeaderCell width={2}>Telefone</Table.HeaderCell>
              <Table.HeaderCell width={2} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.employees.map((employee, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Checkbox
                    toggle
                    checked={employee.employee.enabled}
                    onChange={e =>
                      this.handleEmployeeStatus(e.currentTarget.checked, index)
                    }
                    id={"display-" + index}
                    disabled={this.state.loading}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Image src={employee.avatar} avatar />
                  <span>{employee.firstName + " " + employee.lastName}</span>
                </Table.Cell>
                <Table.Cell>{employee.employee.title}</Table.Cell>
                <Table.Cell>{employee.email}</Table.Cell>
                <Table.Cell>
                  {employee.phone
                    ? formatBrazilianPhoneNumber(employee.phone)
                    : "-"}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Button
                    icon
                    onClick={() => {
                      this.props.setEmployee(employee);
                      this.props.setPage("editar");
                      this.props.history.push(
                        `/dashboard/funcionarios/editar/${
                          employee.employee._id
                        }`
                      );
                    }}
                    id={"edit-" + index}
                    color="blue"
                    compact
                    inverted
                  >
                    <Icon name="edit" />
                  </Button>
                  <Button
                    icon
                    onClick={() => {
                      this.props.setEmployee(employee.employee);
                      this.props.setPage("remover");
                      this.props.history.push(
                        `/dashboard/funcionarios/remover/${
                          employee.employee._id
                        }`
                      );
                    }}
                    id={"remove-" + index}
                    color="red"
                    compact
                    inverted
                  >
                    <Icon name="delete" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {/* <pre>{JSON.stringify(this.state.employees, null, 2)}</pre> */}
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
