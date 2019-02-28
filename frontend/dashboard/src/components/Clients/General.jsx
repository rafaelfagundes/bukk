import React, { Component } from "react";
import { connect } from "react-redux";
import FormTitle from "../Common/FormTitle";
import styled from "styled-components";
import FormSubTitle from "../Common/FormSubTitle";
import { Icon, Divider, Button, Label } from "semantic-ui-react";
import { formatBrazilianPhoneNumber } from "../utils";

const Columns = styled.div`
  display: flex;
  flex-direction: row;

  > div {
    width: 50%;
  }
`;

const StyledLabel = styled.span`
  opacity: 0.8;
`;

export class General extends Component {
  state = {
    page: "view"
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

  render() {
    const { client } = this.props;
    return (
      <>
        {this.state.page === "view" && (
          <>
            <FormTitle
              first
              text={`Dados de ${client.firstName} ${client.lastName}`}
            />
            <Columns>
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
                {client.other.personal.map((o, index) => (
                  <p key={index}>
                    <StyledLabel>{o.title}: </StyledLabel>
                    {o.text}
                  </p>
                ))}
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
                {client.other.contact.map((o, index) => (
                  <p key={index}>
                    <StyledLabel>{o.title}: </StyledLabel>
                    {o.text}
                  </p>
                ))}
              </div>
              <div>
                {client.other && (
                  <>
                    <FormSubTitle first text="Outras Informações" />
                    {client.other.other.map((o, index) => (
                      <p key={index}>
                        <StyledLabel>{o.title}: </StyledLabel>
                        {o.text}
                      </p>
                    ))}
                  </>
                )}
                {client.tags.length > 0 && (
                  <>
                    <FormSubTitle text="Tags" />
                    {client.tags.map((tag, index) => (
                      <Label color={tag.color} key={tag.text}>
                        {tag.text}
                      </Label>
                    ))}
                  </>
                )}
                {/* <pre>{JSON.stringify(this.props.client, null, 2)}</pre> */}
              </div>
            </Columns>
            <Divider style={{ marginTop: "40px" }} />

            <Button icon labelPosition="left" onClick={this.editGeneral}>
              <Icon name="pencil" />
              Editar Informações
            </Button>
          </>
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
