import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentPage, setCompany } from "../dashboardActions";
import ComponentTopMenu from "../Common/ComponentTopMenu";
import NewEdit from "./NewEdit";
import List from "./List";

/* ===============================================================================
  GLOBALS
=============================================================================== */

const menuItems = [
  {
    id: "novo",
    icon: "plus",
    text: "Adicionar Serviço",
    link: "/dashboard/servicos/novo"
  },
  {
    id: "lista",
    icon: "wrench",
    text: "Lista de Serviços",
    link: "/dashboard/servicos/lista"
  }
];
/* ============================================================================ */

export class Services extends Component {
  state = {
    activeItem: undefined,
    serviceId: undefined
  };

  handleMenuClick = value => {
    this.setState({ activeItem: value });
  };

  componentDidMount() {
    if (this.props.match.params.option) {
      if (this.props.match.params.option === "editar") {
        this.setState({
          activeItem: this.props.match.params.option,
          edit: true,
          serviceId: this.props.match.params.id
        });
      } else {
        this.setState({ activeItem: this.props.match.params.option });
      }
    } else {
      this.setState({ activeItem: "lista" });
    }
  }

  setEdit = value => {
    this.setState({ activeItem: "editar", serviceId: value });
    this.props.history.push(`/dashboard/servicos/editar/${value}`);
  };

  render() {
    const { activeItem } = this.state;
    return (
      <div>
        {activeItem && (
          <ComponentTopMenu
            items={menuItems}
            onClick={this.handleMenuClick}
            activeItem={this.state.activeItem}
            link
          />
        )}
        {activeItem === "novo" && (
          <>
            <NewEdit edit={false} {...this.props} />
          </>
        )}
        {activeItem === "editar" && (
          <>
            <NewEdit
              edit={true}
              serviceId={this.state.serviceId}
              {...this.props}
            />
          </>
        )}
        {activeItem === "lista" && (
          <>
            <List setEdit={this.setEdit} />
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentPage: state.dashboard.currentPage,
    company: state.dashboard.company
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage)),
    setCompany: company => dispatch(setCompany(company))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Services);
