import React, { Component } from "react";
import { connect } from "react-redux";
import ComponentTopMenu from "../Common/ComponentTopMenu";
import NewEdit from "./NewEdit";
import List from "./List";
import Delete from "./Delete";

const menuItens = [
  {
    id: "novo",
    icon: "plus",
    text: "Adicionar Funcionário",
    link: "/dashboard/funcionarios/novo"
  },
  {
    id: "lista",
    icon: "users",
    text: "Lista de Funcionários",
    link: "/dashboard/funcionarios/lista"
  }
];

export class Staff extends Component {
  state = {
    activeItem: undefined,
    employee: undefined
  };

  componentDidMount() {
    this.setCurrentItem();
  }

  setEmployee = value => {
    this.setState({ employee: value });
  };

  setCurrentItem = () => {
    const { option } = this.props.match.params;

    let _currrentItem = undefined;

    if (!option) {
      _currrentItem = "lista";
    } else if (option === "lista") {
      _currrentItem = "lista";
    } else if (option === "novo") {
      _currrentItem = "novo";
    } else if (option === "editar") {
      _currrentItem = "editar";
    } else if (option === "remover") {
      _currrentItem = "remover";
    }
    this.setState({ activeItem: _currrentItem });
  };

  handleMenuClick = value => {
    this.setState({ activeItem: value });
  };

  render() {
    return (
      <>
        <ComponentTopMenu
          items={menuItens}
          activeItem={this.state.activeItem}
          onClick={this.handleMenuClick}
          link
        />

        {this.state.activeItem === "novo" && (
          <>
            <NewEdit
              setPage={this.handleMenuClick}
              edit={false}
              {...this.props}
            />
          </>
        )}
        {this.state.activeItem === "editar" && (
          <>
            <NewEdit
              setPage={this.handleMenuClick}
              edit={true}
              user={this.state.employee}
              {...this.props}
            />
          </>
        )}
        {this.state.activeItem === "lista" && (
          <>
            <List
              setPage={this.handleMenuClick}
              setEmployee={this.setEmployee}
              {...this.props}
            />
          </>
        )}
        {this.state.activeItem === "remover" && (
          <>
            <Delete
              setPage={this.handleMenuClick}
              {...this.props}
              employee={this.state.employee}
            />
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
)(Staff);
