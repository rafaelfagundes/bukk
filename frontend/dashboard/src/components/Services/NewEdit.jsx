import React, { Component } from "react";
import { connect } from "react-redux";
import config from "../../config";
import Axios from "axios";
import FormTitle from "../Common/FormTitle";
import { Form, Divider, Button, Icon } from "semantic-ui-react";
import styled from "styled-components";
import Spinner from "react-spinkit";
import Notification from "../Notification/Notification";
import validator from "validator";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */
const ServiceEdit = styled.div`
  @media (min-width: 1441px) {
    /* limit some compenents width on full hd resolutions*/
    max-width: calc(50vw + 200px) !important;
  }
`;
/* ============================================================================ */

export class NewEdit extends Component {
  state = {
    service: {
      cost: 0,
      display: false,
      desc: "",
      value: 0.0,
      duration: 30,
      products: []
    }
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
          // console.log("service", service);
        })
        .catch(error => {
          console.log(error.response.data);
        });
    }
  }

  render() {
    return (
      <div>
        {!this.props.edit && <FormTitle text="Novo Serviço" />}
        {this.props.edit && <FormTitle text="Editar Serviço" />}
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
              />
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Descrição"
                  value={this.state.service.desc}
                  placeholder="Descrição"
                />
              </Form.Group>
              <Form.Group widths={4}>
                <Form.Input
                  fluid
                  label="Valor (R$)"
                  placeholder="Valor"
                  value={this.state.service.value}
                />
                <Form.Input
                  fluid
                  label="Custo (R$)"
                  placeholder="Custo"
                  value={this.state.service.cost}
                />
              </Form.Group>
              <Form.Group widths={4}>
                <Form.Input
                  fluid
                  label="Duração (min)"
                  placeholder="Duração"
                  value={this.state.service.duration}
                />
              </Form.Group>
            </Form>
          </ServiceEdit>
        )}
        <Divider style={{ marginTop: "40px" }} />
        <Button icon labelPosition="left" color="green" type="submit">
          <Icon name="cloud" />
          Salvar
        </Button>
        <Button
          icon
          labelPosition="left"
          floated="right"
          onClick={this.props.history.goBack}
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
