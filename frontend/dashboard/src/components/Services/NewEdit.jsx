import React, { Component } from "react";
import { connect } from "react-redux";
import config from "../../config";
import { formatCurrency } from "../utils";
import Axios from "axios";
import FormTitle from "../Common/FormTitle";
import { toast } from "react-toastify";
import { Form, Divider, Button, Icon } from "semantic-ui-react";
import styled from "styled-components";
import Spinner from "react-spinkit";
import Notification from "../Notification/Notification";
import ValidationError from "../Common/ValidationError";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */
const ServiceEdit = styled.div`
  @media (min-width: 1441px) {
    /* limit some compenents width on full hd resolutions*/
    max-width: calc(50vw + 200px) !important;
  }
`;

const StyledError = styled(ValidationError)`
  margin: -10px 0 20px 0 !important;
`;

/* ============================================================================ */

const errorsList = {
  desc: "",
  value: "",
  cost: "",
  duration: ""
};

export class NewEdit extends Component {
  state = {
    service: {
      cost: 0,
      display: false,
      desc: "",
      value: 0.0,
      duration: 30,
      products: []
    },
    errors: errorsList
  };

  componentDidMount() {
    const { edit, serviceId } = this.props;

    // console.log(edit, serviceId);

    if (edit) {
      const token = localStorage.getItem("token");
      let requestConfig = {
        headers: {
          Authorization: token
        }
      };

      Axios.post(
        config.api + "/services/company/get",
        { id: serviceId },
        requestConfig
      )
        .then(response => {
          const { service } = response.data;
          this.setState({ service });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  handleInput = (value, key) => {
    this.setState({
      service: {
        ...this.state.service,
        [key]: value
      }
    });
  };

  validate = () => {
    function isCurrency(value) {
      value = String(value).replace(/\D/g, "");

      if (value === "") {
        return false;
      }

      try {
        if (typeof Number(value) === "number") {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }
    function isNumber(value) {
      value = String(value).replace(/\D/g, "");

      if (value === "") {
        return false;
      }

      try {
        if (typeof Number(value) === "number") {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }

    let errors = JSON.parse(JSON.stringify(errorsList));

    const { service } = this.state;

    let errorsCount = 0;
    if (service.desc === "") {
      errors.desc = "Por favor preencha a descrição";
      errorsCount++;
    }
    if (service.value === "") {
      errors.value = "Por favor preencha o valor";
      errorsCount++;
    }
    if (service.cost === "") {
      errors.cost = "Por favor preencha o custo";
      errorsCount++;
    }
    if (service.duration === "") {
      errors.duration = "Por favor preencha a duração";
      errorsCount++;
    }
    if (!isCurrency(service.value)) {
      errors.value = "Por favor preencha corretamente o valor";
      errorsCount++;
    }
    if (!isCurrency(service.cost)) {
      errors.cost = "Por favor preencha corretamente o custo";
      errorsCount++;
    }
    if (!isNumber(service.duration)) {
      errors.duration = "Por favor preencha corretamente a duração";
      errorsCount++;
    } else {
      if (Number(service.duration) === 0) {
        errors.duration = "A duração não pode ser nula";
        errorsCount++;
      }
    }

    this.setState({
      errors
    });

    if (errorsCount) {
      return false;
    } else {
      return true;
    }
  };

  saveOrUpdate = () => {
    if (!this.validate()) {
      return false;
    }

    let _service = JSON.parse(JSON.stringify(this.state.service));
    _service.value = Number(String(_service.value).replace(",", "."));
    _service.cost = Number(String(_service.cost).replace(",", "."));
    _service.duration = Number(_service.duration);

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    if (this.props.edit) {
      Axios.post(
        config.api + "/services/company/update",
        _service,
        requestConfig
      )
        .then(response => {
          this.props.history.push("/dashboard/servicos/lista");
          this.props.setPage("lista");
          toast(
            <Notification
              type="success"
              title="Serviços atualizados"
              text="O serviço foi atualizado com sucesso"
            />
          );
        })
        .catch(error => {
          toast(
            <Notification
              type="error"
              title="Erro ao atualizar"
              text="Erro ao tentar atualizar o serviço"
            />
          );
        });
    } else {
      Axios.post(config.api + "/services/company/add", _service, requestConfig)
        .then(response => {
          this.props.history.push("/dashboard/servicos/lista");
          this.props.setPage("lista");
          toast(
            <Notification
              type="success"
              title="Serviços atualizados"
              text="O serviço foi atualizado com sucesso"
            />
          );
        })
        .catch(error => {
          toast(
            <Notification
              type="error"
              title="Erro ao atualizar"
              text="Erro ao tentar atualizar o serviço"
            />
          );
        });
    }
  };

  render() {
    return (
      <div>
        {!this.props.edit && <FormTitle text="Novo Serviço" />}
        {this.props.edit && (
          <FormTitle text={`Editar - ${this.state.service.desc}`} />
        )}
        {this.state.service && (
          <ServiceEdit>
            <Form>
              <Form.Checkbox
                toggle
                label={
                  <label>
                    Mostrar este serviço na interface de agendamento
                  </label>
                }
                checked={this.state.service.display}
                onChange={e => {
                  this.handleInput(!this.state.service.display, "display");
                }}
              />
              <Form.Group>
                <Form.Input
                  width={8}
                  label="Descrição"
                  value={this.state.service.desc}
                  placeholder="Descrição"
                  onChange={e => {
                    this.handleInput(e.currentTarget.value, "desc");
                  }}
                />
              </Form.Group>
              <StyledError
                show={this.state.errors.desc !== ""}
                error={this.state.errors.desc}
              />
              <Form.Group widths={8}>
                <Form.Input
                  fluid
                  label="Valor (R$)"
                  placeholder="Valor"
                  value={this.state.service.value}
                  onChange={e => {
                    this.handleInput(e.currentTarget.value, "value");
                  }}
                  onBlur={e =>
                    this.handleInput(
                      e.currentTarget.value === ""
                        ? "0"
                        : formatCurrency(e.currentTarget.value),
                      "value"
                    )
                  }
                />
                <Form.Input
                  fluid
                  label="Custo (R$)"
                  placeholder="Custo"
                  value={this.state.service.cost}
                  onChange={e => {
                    this.handleInput(e.currentTarget.value, "cost");
                  }}
                  onBlur={e =>
                    this.handleInput(
                      e.currentTarget.value === ""
                        ? "0"
                        : formatCurrency(e.currentTarget.value),
                      "cost"
                    )
                  }
                />
              </Form.Group>
              <StyledError
                show={this.state.errors.value !== ""}
                error={this.state.errors.value}
              />
              <StyledError
                show={this.state.errors.cost !== ""}
                error={this.state.errors.cost}
              />
              <Form.Group widths={8}>
                <Form.Input
                  fluid
                  label="Duração (min)"
                  placeholder="Duração"
                  value={this.state.service.duration}
                  onChange={e => {
                    this.handleInput(e.currentTarget.value, "duration");
                  }}
                />
              </Form.Group>
              <StyledError
                show={this.state.errors.duration !== ""}
                error={this.state.errors.duration}
              />
            </Form>
          </ServiceEdit>
        )}
        <Divider style={{ marginTop: "40px" }} />
        <Button
          icon
          labelPosition="left"
          color="green"
          type="submit"
          onClick={this.saveOrUpdate}
        >
          <Icon name={this.props.edit ? "edit" : "plus"} />
          {this.props.edit ? "Editar" : "Adicionar"}
        </Button>
        <Button
          icon
          labelPosition="left"
          floated="right"
          onClick={() => {
            this.props.history.push("/dashboard/servicos/lista");
            this.props.setPage("lista");
          }}
        >
          <Icon name="left arrow" />
          Voltar
        </Button>
        {this.state.loading && (
          <Spinner
            style={{ top: "6px", left: "5px", display: "inline-block" }}
            name="circle"
            color={this.props.company.settings.colors.primaryBack}
          />
        )}

        {/* <pre>{JSON.stringify(this.state.service, null, 2)}</pre> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEdit);
