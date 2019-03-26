import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  Table,
  Menu,
  Icon,
  Button,
  Segment,
  Header,
  Input,
  Confirm
} from "semantic-ui-react";
import { formatBrazilianPhoneNumber } from "../utils";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Axios from "axios";
import config from "../../config";
import Notification from "../Notification/Notification";

var SEARCH_TIMEOUT = undefined;
var MAX_NUMBER_RESULTS = 9;

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const Results = styled.div`
  position: absolute;
  line-height: 42px;
  color: rgba(0, 0, 0, 0.7);
`;

const SinglePage = styled.div`
  min-height: 42px;
`;

const SearchInput = styled(Input)`
  height: initial !important;
  width: 100% !important;
  > ::placeholder {
    color: #555 !important;
  }
  > button {
    height: initial !important;
    width: initial !important;
  }
`;

const ClearSearchButton = styled(Button)`
  height: 43px;
  width: 120px;
  margin-left: 10px !important;
`;

const SearchHolder = styled.div`
  display: flex;
`;

/* ============================================================================ */

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
  state = {
    costumers: [],
    allCostumers: undefined,
    clients: [],
    searchQuery: "",
    searchLoading: false,
    pagination: {
      pages: []
    },
    clearSearchButton: false,
    confirm: false,
    removeId: ""
  };

  componentDidMount() {
    this.mountOrPagination();
  }

  setPagination = (count, currentPage, type = "list") => {
    const pages = Math.ceil(count / MAX_NUMBER_RESULTS);

    let _pagination = {
      count,
      currentPage,
      showPrev: currentPage === 1 ? false : true,
      showNext: currentPage === pages ? false : true,
      pages: [],
      type
    };

    for (let index = 0; index < pages; index++) {
      _pagination.pages.push({
        number: index + 1
      });
    }

    this.setState({ pagination: _pagination });
  };

  changePage = (page, type = "list") => {
    if (type === "list") {
      this.mountOrPagination(page - 1);
    }
    if (type === "search") {
      this.search(this.state.searchQuery, page - 1);
    }
  };

  handleSearch = e => {
    let { value } = e.currentTarget;

    if (e.currentTarget.className.indexOf("button") !== -1) {
      value = this.state.searchQuery;
    }

    if (value === "") {
      this.clearSearch();
      clearTimeout(SEARCH_TIMEOUT);
    } else {
      this.setState({ searchQuery: value, searchLoading: true });
      clearTimeout(SEARCH_TIMEOUT);
      SEARCH_TIMEOUT = setTimeout(() => {
        this.search(value);
      }, 500);
    }
  };

  clearSearch = e => {
    this.setState(
      {
        searchQuery: "",
        searchLoading: false,
        costumers: JSON.parse(JSON.stringify(this.state.allCostumers)),
        clearSearchButton: false
      },
      () => {
        this.setPagination(this.state.allCostumersCount, 1, "list");
      }
    );
  };

  search(value, page = 0) {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };
    Axios.post(
      config.api + "/costumers/find",
      { query: value, page, limit: MAX_NUMBER_RESULTS },
      requestConfig
    )
      .then(response => {
        clearTimeout(SEARCH_TIMEOUT);
        const { count, page, costumers } = response.data;
        this.setPagination(count, page, "search");
        this.props.setPage("lista");
        this.setState({
          costumers: costumers,
          searchLoading: false,
          clearSearchButton: true
        });
      })
      .catch(error => {
        console.log(`Não foi possível pesquisar: ${error}`);
        this.setState({ searchLoading: false });
      });
  }

  mountOrPagination(page = 0) {
    this.getClients(page);
  }

  getClients(page = 0) {
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };
    Axios.post(
      config.api + "/costumers/list",
      { page, limit: MAX_NUMBER_RESULTS },
      requestConfig
    )
      .then(response => {
        const { count, page, costumers } = response.data;
        this.setPagination(count, page, "list");
        this.props.setPage("lista");
        this.setState({
          costumers: costumers,
          allCostumers: costumers,
          allCostumersCount: count
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  delete = () => {
    console.log("remover cliente", this.state.removeId);
    this.setState({ confirm: false });

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/costumers/delete",
      { id: this.state.removeId },
      requestConfig
    )
      .then(response => {
        console.log(response.data);
        this.getClients();
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

  removeClient = id => {
    this.setState({ confirm: true, removeId: id });
  };

  closeConfirm = () => {
    this.setState({ confirm: false });
  };

  render() {
    return (
      <>
        <Confirm
          open={this.state.confirm}
          header="Tem certeza?"
          content="Tem certeza que deseja remover o cliente?"
          onCancel={this.closeConfirm}
          onConfirm={this.delete}
          cancelButton="Cancelar"
          confirmButton="Remover"
          size="tiny"
        />
        {this.state.costumers.length > 0 && (
          <>
            <SearchHolder>
              <SearchInput
                action={
                  <Button
                    icon="search"
                    loading={this.state.searchLoading}
                    content="Pesquisar"
                    onClick={this.handleSearch}
                    color="blue"
                  />
                }
                placeholder="Pesquisar cliente..."
                onChange={this.handleSearch}
                value={this.state.searchQuery}
              />
              {this.state.clearSearchButton && (
                <ClearSearchButton
                  icon="eraser"
                  content="Limpar"
                  onClick={this.clearSearch}
                />
              )}
            </SearchHolder>
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
                {this.state.costumers.map((client, index) => (
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
                      <Link to={`/dashboard/cliente/id/${client._id}`}>
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
                        onClick={() => this.removeClient(client._id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>

              {this.state.pagination && (
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan="5">
                      <Results>
                        <Icon name="list" />
                        {this.state.pagination.count} resultados
                      </Results>
                      {this.state.pagination.pages.length <= 1 && (
                        <SinglePage />
                      )}
                      {this.state.pagination.pages.length > 1 && (
                        <Menu floated="right" pagination>
                          {this.state.pagination.showPrev && (
                            <Menu.Item
                              as="a"
                              icon
                              onClick={() => {
                                this.changePage(
                                  this.state.pagination.currentPage - 1,
                                  this.state.pagination.type
                                );
                              }}
                            >
                              <Icon name="chevron left" />
                            </Menu.Item>
                          )}
                          {this.state.pagination.pages.map((p, index) => (
                            <React.Fragment key={index}>
                              {p.number ===
                                this.state.pagination.currentPage && (
                                <Menu.Item active={true} as="a">
                                  {p.number}
                                </Menu.Item>
                              )}
                              {p.number !==
                                this.state.pagination.currentPage && (
                                <Menu.Item
                                  as="a"
                                  onClick={() => {
                                    this.changePage(
                                      p.number,
                                      this.state.pagination.type
                                    );
                                  }}
                                >
                                  {p.number}
                                </Menu.Item>
                              )}
                            </React.Fragment>
                          ))}
                          {this.state.pagination.showNext && (
                            <Menu.Item
                              as="a"
                              icon
                              onClick={() => {
                                this.changePage(
                                  this.state.pagination.currentPage + 1,
                                  this.state.pagination.type
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
          </>
        )}
        {this.state.costumers.length === 0 && (
          <Segment placeholder>
            <Header icon>
              <Icon name="search" />
              Nenhum cliente foi encontrado.
            </Header>
            <Segment.Inline>
              <Button primary onClick={this.state.clearSearch}>
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
