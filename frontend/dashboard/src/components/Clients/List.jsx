import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Menu, Icon, Button, Segment, Header } from "semantic-ui-react";
import { formatBrazilianPhoneNumber } from "../utils";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Results = styled.div`
  position: absolute;
  line-height: 42px;
  color: rgba(0, 0, 0, 0.7);
`;

const SinglePage = styled.div`
  min-height: 42px;
`;

const mapGender = (gender, title = false) => {
  if (!title) {
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
  } else {
    if (gender === "M") {
      return "Masculino";
    } else if (gender === "F") {
      return "Feminino";
    } else {
      return "Outro";
    }
  }
};

const phoneFormat = (phone, title = false) => {
  if (!title) {
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
  } else {
    if (phone[0].whatsApp) {
      return formatBrazilianPhoneNumber(phone[0].number) + " - Número WhatsApp";
    } else {
      return formatBrazilianPhoneNumber(phone[0].number);
    }
  }
};

export class List extends Component {
  render() {
    return (
      <>
        {this.props.clients.length > 0 && (
          <Table singleLine compact striped fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={5}>Nome</Table.HeaderCell>
                <Table.HeaderCell width={2}>Sexo</Table.HeaderCell>
                <Table.HeaderCell width={4}>Email</Table.HeaderCell>
                <Table.HeaderCell width={3}>Telefone</Table.HeaderCell>
                <Table.HeaderCell width={2} />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.props.clients.map((client, index) => (
                <Table.Row key={index}>
                  <Table.Cell title={client.fullName}>
                    {client.fullName}
                  </Table.Cell>
                  <Table.Cell title={mapGender(client.gender, true)}>
                    {mapGender(client.gender)}
                  </Table.Cell>
                  <Table.Cell title={client.email}>{client.email}</Table.Cell>
                  <Table.Cell title={phoneFormat(client.phone, true)}>
                    {phoneFormat(client.phone)}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Link to={`/dashboard/client/id/${client._id}`}>
                      <Button
                        compact
                        icon="edit outline"
                        title="Ver/Editar Cliente"
                        inverted
                        color="blue"
                      />
                    </Link>

                    <Button
                      compact
                      icon="delete"
                      title="Remover Cliente"
                      inverted
                      color="red"
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

            {this.props.pagination && (
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="5">
                    <Results>
                      <Icon name="list" />
                      {this.props.pagination.count} resultados
                    </Results>
                    {this.props.pagination.pages.length <= 1 && <SinglePage />}
                    {this.props.pagination.pages.length > 1 && (
                      <Menu floated="right" pagination>
                        {this.props.pagination.showPrev && (
                          <Menu.Item
                            as="a"
                            icon
                            onClick={() => {
                              this.props.changePage(
                                this.props.pagination.currentPage - 1,
                                this.props.pagination.type
                              );
                            }}
                          >
                            <Icon name="chevron left" />
                          </Menu.Item>
                        )}
                        {this.props.pagination.pages.map((p, index) => (
                          <React.Fragment key={index}>
                            {p.number === this.props.pagination.currentPage && (
                              <Menu.Item active={true} as="a">
                                {p.number}
                              </Menu.Item>
                            )}
                            {p.number !== this.props.pagination.currentPage && (
                              <Menu.Item
                                as="a"
                                onClick={() => {
                                  this.props.changePage(
                                    p.number,
                                    this.props.pagination.type
                                  );
                                }}
                              >
                                {p.number}
                              </Menu.Item>
                            )}
                          </React.Fragment>
                        ))}
                        {this.props.pagination.showNext && (
                          <Menu.Item
                            as="a"
                            icon
                            onClick={() => {
                              this.props.changePage(
                                this.props.pagination.currentPage + 1,
                                this.props.pagination.type
                              );
                            }}
                          >
                            <Icon name="chevron right" />
                          </Menu.Item>
                        )}
                      </Menu>
                    )}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            )}
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
