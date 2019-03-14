import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentPage } from "../dashboardActions";
import ComponentTopMenu from "../Common/ComponentTopMenu";
import Axios from "axios";
import config from "../../config";
import { List } from "./List";
import { Input, Button } from "semantic-ui-react";
import styled from "styled-components";
import NewEdit from "./NewEdit";

var SEARCH_TIMEOUT = undefined;
var MAX_NUMBER_RESULTS = 10;

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

const menuItems = [
  {
    id: "novo",
    icon: "user plus",
    text: "Adicionar Cliente",
    link: "/dashboard/clientes/novo"
  },
  {
    id: "info",
    icon: "chart bar",
    text: "Informações",
    link: "/dashboard/clientes/informacoes"
  },
  {
    id: "lista",
    icon: "address book outline",
    text: "Lista de Clientes",
    link: "/dashboard/clientes"
  }
];

export class Clients extends Component {
  constructor(props) {
    super(props);
    let _activeItem = undefined;

    if (props.match.params.option === "lista") {
      _activeItem = "lista";
    } else if (props.match.params.option === "novo") {
      _activeItem = "novo";
    } else if (props.match.params.option === "informacoes") {
      _activeItem = "info";
    } else if (props.match.params.option === undefined) {
      _activeItem = "lista";
    } else {
      _activeItem = "lista";
    }
    this.state = {
      activeItem: _activeItem,
      costumers: undefined,
      allCostumers: undefined,
      searchQuery: "",
      searchLoading: false,
      pagination: undefined,
      clearSearchButton: false
    };
  }

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

  handleMenuClick = value => {
    this.setState({ activeItem: value });
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
    this.props.setCurrentPage({
      icon: "users",
      title: "Clientes"
    });
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

  render() {
    return (
      <>
        <ComponentTopMenu
          items={menuItems}
          onClick={this.handleMenuClick}
          link
          activeItem={this.state.activeItem}
        />
        {this.state.activeItem === "lista" && (
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
                // size="large"
              />
              {this.state.clearSearchButton && (
                <ClearSearchButton
                  icon="eraser"
                  content="Limpar"
                  onClick={this.clearSearch}
                />
              )}
            </SearchHolder>
            {this.state.costumers && (
              <List
                clients={this.state.costumers}
                clearSearch={this.clearSearch}
                pagination={this.state.pagination}
                changePage={this.changePage}
              />
            )}

            {/* <pre>{JSON.stringify(this.state.costumers, null, 2)}</pre> */}
          </>
        )}
        {this.state.activeItem === "info" && (
          <>
            <h1>Informações</h1>
          </>
        )}
        {this.state.activeItem === "novo" && (
          <>
            <NewEdit {...this.props} newOrEdit="new" />
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    company: state.dashboard.company,
    currentPage: state.dashboard.currentPage,
    user: state.dashboard.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Clients);
