import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentPage } from "../dashboardActions";
import "./Profile.css";
import Services from "./Services";
import General from "./General";
import TimeTable from "./TimeTable";
import ComponentTopMenu from "../Common/ComponentTopMenu";

const menuItemsAdmin = [
  {
    id: "geral",
    icon: "user outline",
    text: "Dados Pessoais"
  },
  {
    id: "preferencias",
    icon: "settings",
    text: "Preferências"
  }
];

const menuItemsEmployee = [
  {
    id: "geral",
    icon: "user outline",
    text: "Dados Pessoais"
  },
  {
    id: "servicos",
    icon: "wrench",
    text: "Serviços"
  },
  {
    id: "horarios",
    icon: "clock outline",
    text: "Horários"
  },
  {
    id: "preferencias",
    icon: "settings",
    text: "Preferências"
  }
];

class Profile extends Component {
  state = {
    activeItem: "geral",
    page: "general",
    loading: false
  };

  handleItemClick = name => this.setState({ activeItem: name });

  componentDidMount() {
    if (this.props.user) {
      this.props.setCurrentPage({
        title: "Perfil de " + this.props.user.firstName,
        icon: "user circle"
      });
    }
  }

  render() {
    return (
      <>
        <div className="profile-container">
          {this.props.user !== undefined && (
            <>
              {this.props.user.role === "owner" && (
                <ComponentTopMenu
                  items={menuItemsAdmin}
                  onClick={this.handleItemClick}
                  activeItem={this.state.activeItem}
                  colors={this.props.company.settings.colors}
                />
              )}
              {this.props.user.role === "employee" && (
                <ComponentTopMenu
                  items={menuItemsEmployee}
                  onClick={this.handleItemClick}
                  activeItem={this.state.activeItem}
                  colors={this.props.company.settings.colors}
                />
              )}
            </>
          )}

          {this.state.activeItem === "geral" && <General />}
          {this.state.activeItem === "servicos" && <Services />}
          {this.state.activeItem === "horarios" && <TimeTable />}
          {this.state.activeItem === "preferencias" && (
            <div className="profile-config" />
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.dashboard.user,
    currentPage: state.dashboard.currentPage,
    company: state.dashboard.company
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
)(Profile);
