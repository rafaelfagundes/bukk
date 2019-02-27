import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Menu, Icon, Button, Segment, Header } from "semantic-ui-react";
import { formatBrazilianPhoneNumber } from "../utils";
import { Link } from "react-router-dom";

const mapGender = gender => {
  if (gender === "M") {
    return (
      <span>
        <Icon name="mars" /> Masculino
      </span>
    );
  } else if (gender === "F") {
    return (
      <span>
        <Icon name="venus" /> Feminino
      </span>
    );
  } else {
    return (
      <span>
        <Icon name="genderless" /> Outro
      </span>
    );
  }
};

const phoneFormat = phone => {
  const [_phone] = phone;

  if (_phone.whatsApp) {
    return (
      <span>
        {formatBrazilianPhoneNumber(_phone.number)}{" "}
        <Icon name="whatsapp" color="green" />
      </span>
    );
  } else {
    return <span>{formatBrazilianPhoneNumber(_phone.number)}</span>;
  }
};

export class List extends Component {
  render() {
    return (
      <>
        {this.props.clients.length > 0 && (
          <Table celled compact>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Nome</Table.HeaderCell>
                <Table.HeaderCell>Sexo</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Telefone</Table.HeaderCell>
                <Table.HeaderCell>Ações</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.props.clients.map((client, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{client.fullName}</Table.Cell>
                  <Table.Cell>{mapGender(client.gender)}</Table.Cell>
                  <Table.Cell>{client.email}</Table.Cell>
                  <Table.Cell>{phoneFormat(client.phone)}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/dashboard/client/id/${client._id}`}>
                      <Button icon="edit outline" color="blue" title="" />
                    </Link>

                    <Button icon="delete" color="red" title="" />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5">
                  <Menu floated="right" pagination>
                    <Menu.Item as="a" icon>
                      <Icon name="chevron left" />
                    </Menu.Item>
                    <Menu.Item as="a">1</Menu.Item>
                    <Menu.Item as="a">2</Menu.Item>
                    <Menu.Item as="a">3</Menu.Item>
                    <Menu.Item as="a">4</Menu.Item>
                    <Menu.Item as="a" icon>
                      <Icon name="chevron right" />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        )}
        {this.props.clients.length === 0 && (
          <Segment placeholder>
            <Header icon>
              <Icon name="search" />
              Nenhum cliente foi encontrado.
            </Header>
            <Segment.Inline>
              <Button primary onClick={this.props.clearSearch}>
                Limpar Buscar
              </Button>
            </Segment.Inline>
          </Segment>
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
)(List);
