import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "semantic-ui-react";
import { setCurrentPage } from "../dashboardActions";
import "./Profile.css";
import Services from "./Services";
import General from "./General";
import TimeTable from "./TimeTable";

class Profile extends Component {
  state = {
    activeItem: "geral",
    page: "general",
    loading: false
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  componentDidMount() {
    if (this.props.user) {
      this.props.setCurrentPage({
        title: "Perfil de " + this.props.user.firstName,
        icon: "user circle"
      });
    }
  }

  render() {
    const { activeItem } = this.state;
    return (
      <>
        <div className="profile-container">
          {this.props.user !== undefined && (
            <>
              <Menu borderless className="pages-menu">
                <Menu.Item
                  name="geral"
                  active={activeItem === "geral"}
                  onClick={this.handleItemClick}
                  icon="user outline"
                  content="Dados Pessoais"
                />
                {this.props.user.role === "employee" && (
                  <>
                    <Menu.Item
                      name="servicos"
                      active={activeItem === "servicos"}
                      onClick={this.handleItemClick}
                      content="Serviços"
                      icon="wrench"
                    />
                    <Menu.Item
                      name="horarios"
                      active={activeItem === "horarios"}
                      onClick={this.handleItemClick}
                      content="Horários"
                      icon="clock outline"
                    />
                  </>
                )}
                <Menu.Item
                  name="preferencias"
                  active={activeItem === "preferencias"}
                  onClick={this.handleItemClick}
                  content="Preferências"
                  icon="settings"
                />
              </Menu>
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
