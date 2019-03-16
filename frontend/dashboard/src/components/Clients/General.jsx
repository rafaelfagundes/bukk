import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import FormTitle from "../Common/FormTitle";
import styled from "styled-components";
import FormSubTitle from "../Common/FormSubTitle";
import { Icon, Divider, Button, Label } from "semantic-ui-react";
import { formatBrazilianPhoneNumber, formatCEP } from "../utils";
import { NewEdit } from "./NewEdit";
import Axios from "axios";
import config from "../../config";
import Notification from "../Notification/Notification";

/* ============================================================================
  STYLED COMPONENTS
============================================================================ */

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

/* ========================================================================= */

export class General extends Component {
  state = {
    page: "view",
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

  toggleEdit = () => {
    if (this.state.page === "view") {
      this.setState({ page: "edit" });
      this.props.showStatistics(false);
    } else {
      this.setState({ page: "view" });
      this.props.showStatistics(true);
    }
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

  delete = id => {
    this.setState({ confirm: false });

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(config.api + "/costumers/delete", { id }, requestConfig)
      .then(response => {
        console.log(response.data);
        this.props.history.goBack();
        toast(
          <Notification
            type="success"
            title="Cliente removido"
            text="Os cliente foi removido com sucesso"
          />
        );
      })
      .catch(error => {
        toast(
          <Notification
            type="error"
            title="Erro ao remover"
            text="Erro ao tentar remover o cliente"
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
            <FormTitle text={`Informações Básicas`} />
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
                {client.address.street !== "" && (
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
              color="red"
              onClick={() => this.delete(this.state.client._id)}
            >
              <Icon name="delete" />
              Remover Cliente
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
          <NewEdit
            {...this.props}
            newOrEdit="edit"
            client={this.props.client}
          />
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
