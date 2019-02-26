import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentPage } from "../dashboardActions";
import ComponentTopMenu from "../Common/ComponentTopMenu";
import Axios from "axios";
import config from "../../config";
import { List } from "./List";
import { Input, Button } from "semantic-ui-react";
import styled from "styled-components";

var SEARCH_TIMEOUT = undefined;

const SearchInput = styled(Input)`
  height: initial !important;
  width: 100% !important;

  > button {
    height: initial !important;
    width: initial !important;
  }
`;

const menuItems = [
  {
    id: "lista",
    icon: "address book outline",
    text: "Listagem",
    link: "/dashboard/clientes"
  },
  {
    id: "info",
    icon: "chart bar",
    text: "Informações",
    link: "/dashboard/clientes/informacoes"
  }
];

export class Clients extends Component {
  constructor(props) {
    super(props);
    let _activeItem = undefined;
    if (props.match.params.option === "lista") {
      _activeItem = "lista";
    } else if (props.match.params.option === "informacoes") {
      _activeItem = "info";
    } else {
      _activeItem = "lista";
    }
    this.state = {
      activeItem: _activeItem,
      costumers: undefined,
      allCostumers: undefined,
      searchQuery: "",
      searchLoading: false
    };
  }

  componentDidMount() {
    this.props.setCurrentPage({
      icon: "users",
      title: "Clientes"
    });

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(config.api + "/costumers/list", {}, requestConfig)
      .then(response => {
        this.setState({
          costumers: response.data,
          allCostumers: response.data
        });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }

  handleMenuClick = value => {
    this.setState({ activeItem: value });
  };

  search = e => {
    /*
var delayTimer;
function doSearch(text) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
        // Do the ajax stuff
    }, 1000); // Will do the ajax stuff after 1000 ms, or 1 s
}
*/
    let { value } = e.currentTarget;

    if (e.currentTarget.className.indexOf("button") !== -1) {
      value = this.state.searchQuery;
    }

    if (value === "") {
      this.setState({
        searchQuery: value,
        searchLoading: false,
        costumers: JSON.parse(JSON.stringify(this.state.allCostumers))
      });
      clearTimeout(SEARCH_TIMEOUT);
    } else {
      this.setState({ searchQuery: value, searchLoading: true });
      clearTimeout(SEARCH_TIMEOUT);
      SEARCH_TIMEOUT = setTimeout(() => {
        const token = localStorage.getItem("token");
        let requestConfig = {
          headers: {
            Authorization: token
          }
        };
        Axios.post(
          config.api + "/costumers/find",
          { query: value },
          requestConfig
        )
          .then(response => {
            clearTimeout(SEARCH_TIMEOUT);
            this.setState({
              costumers: response.data.result,
              searchLoading: false
            });
          })
          .catch(error => {
            console.log("Não foi possível pesquisar");
            this.setState({ searchLoading: false });
          });
      }, 500);
    }
  };

  clearSearch = e => {
    this.setState({
      searchQuery: "",
      searchLoading: false,
      costumers: JSON.parse(JSON.stringify(this.state.allCostumers))
    });
  };

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
            <div style={{ width: "100%" }}>
              <SearchInput
                action={
                  <Button
                    icon="search"
                    loading={this.state.searchLoading}
                    content="Pesquisar"
                    onClick={this.search}
                  />
                }
                placeholder="Pesquisar cliente..."
                onChange={this.search}
                value={this.state.searchQuery}
              />
            </div>
            {this.state.costumers && (
              <List
                clients={this.state.costumers}
                clearSearch={this.clearSearch}
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
