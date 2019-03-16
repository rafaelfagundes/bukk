import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentPage } from "../dashboardActions";
import ComponentTopMenu from "../Common/ComponentTopMenu";

import List from "./List";
import NewEdit from "./NewEdit";

/* ===============================================================================
  GLOBALS
=============================================================================== */

const menuItems = [
  {
    id: "novo",
    icon: "user plus",
    text: "Adicionar Cliente",
    link: "/dashboard/clientes/novo"
  },
  // {
  //   id: "info",
  //   icon: "chart bar",
  //   text: "Informações",
  //   link: "/dashboard/clientes/informacoes"
  // },
  {
    id: "lista",
    icon: "address book outline",
    text: "Lista de Clientes",
    link: "/dashboard/clientes/lista"
  }
];

/* ============================================================================ */

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

  mountOrPagination(page = 0) {
    this.props.setCurrentPage({
      icon: "users",
      title: "Clientes"
    });
  }

  handleMenuClick = value => {
    this.setState({ activeItem: value });
  };

  render() {
    return (
      <>
        <ComponentTopMenu
          items={menuItems}
          onClick={this.handleMenuClick}
          activeItem={this.state.activeItem}
          link
        />
        {this.state.activeItem === "lista" && (
          <List
            clients={this.state.costumers}
            clearSearch={this.clearSearch}
            pagination={this.state.pagination}
            changePage={this.changePage}
            setPage={this.handleMenuClick}
            {...this.props}
          />
        )}
        {this.state.activeItem === "info" && (
          <>
            <h1>Informações</h1>
          </>
        )}
        {this.state.activeItem === "novo" && (
          <>
            <NewEdit
              {...this.props}
              newOrEdit="new"
              setPage={this.handleMenuClick}
            />
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
