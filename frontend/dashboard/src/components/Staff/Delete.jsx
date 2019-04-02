import React, { Component } from "react";
import { connect } from "react-redux";
import FormTitle from "../Common/FormTitle";
import Spinner from "react-spinkit";
import Axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import Notification from "../Notification/Notification";
import Information from "../Common/Information";
import { Button, Confirm, Divider, Icon } from "semantic-ui-react";
import { setCurrentPage, setCompany } from "../dashboardActions";

export class Delete extends Component {
  state = {
    loading: false,
    confirmRemoveToggle: false,
    employee: this.props.employee ? this.props.employee : undefined
  };

  componentDidMount() {
    let id = undefined;

    if (this.props.employee) {
      id = this.props.employee._id;
    } else {
      id = this.props.match.params.id;
    }

    if (this.state.employee === undefined) {
      const token = localStorage.getItem("token");
      let requestConfig = {
        headers: {
          Authorization: token
        }
      };

      Axios.post(config.api + "/specialists/get", { id }, requestConfig)
        .then(response => {
          this.setState({ employee: response.data });
        })
        .catch(error => {
          toast(
            <Notification
              type="error"
              title="Erro ao carregar os dados"
              text="Tente novamente mais tarde"
            />
          );
        });
    }
  }

  handleEmployeeStatus = employee => {
    employee.enabled = !employee.enabled;

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
        this.props.setPage("lista");
        this.props.history.push(`/dashboard/funcionarios/lista`);
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
  };

  handleEmployeeRemove = () => {
    console.log("remover o funcionario");
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/specialists/delete",
      { id: this.state.employee._id },
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
        this.props.setPage("lista");
        this.props.history.push(`/dashboard/funcionarios/lista`);
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
    this.setState({ confirmRemoveToggle: false });
  };

  confirmRemove = () => {
    this.setState({ confirmRemoveToggle: !this.state.confirmRemoveToggle });
  };

  render() {
    const { employee } = this.state;
    return (
      <>
        {this.state.employee !== undefined && (
          <>
            <FormTitle text="Controle de Funcionário" first />
            <>
              <Button
                color="blue"
                icon="power"
                content={employee.enabled ? "Desativar" : "Ativar"}
                onClick={() => this.handleEmployeeStatus(employee)}
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
              size="tiny"
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
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentPage: state.dashboard.currentPage,
    company: state.dashboard.company
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage)),
    setCompany: company => dispatch(setCompany(company))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Delete);
