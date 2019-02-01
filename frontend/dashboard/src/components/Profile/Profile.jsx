import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import { setCurrentPage } from "../dashboardActions";
import "./Profile.css";
import Services from "./Services";
import General from "./General";

class Profile extends Component {
  state = {
    activeItem: "servicos",
    page: "general",
    loading: false
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  componentDidUpdate() {
    if (this.state.user === undefined) {
      this.setState({ user: this.props.user, employee: this.props.employee });
    }

    if (this.props.user && !this.props.currentPage) {
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
              {this.props.user.role === "employee" && (
                <Button.Group className="profile-menu" widths="4" basic>
                  <Button
                    name="geral"
                    active={this.state.activeItem === "geral"}
                    onClick={this.handleItemClick}
                  >
                    Geral
                  </Button>
                  <Button
                    name="servicos"
                    active={this.state.activeItem === "servicos"}
                    onClick={this.handleItemClick}
                  >
                    Serviços
                  </Button>
                  <Button
                    name="horarios"
                    active={this.state.activeItem === "horarios"}
                    onClick={this.handleItemClick}
                  >
                    Horários
                  </Button>
                  <Button
                    name="preferencias"
                    active={this.state.activeItem === "preferencias"}
                    onClick={this.handleItemClick}
                  >
                    Preferências
                  </Button>
                </Button.Group>
              )}
              {this.props.user.role === "owner" && (
                <Button.Group className="profile-menu" widths="4" basic>
                  <Button
                    name="geral"
                    active={this.state.activeItem === "geral"}
                    onClick={this.handleItemClick}
                  >
                    Geral
                  </Button>
                  <Button
                    name="preferencias"
                    active={this.state.activeItem === "preferencias"}
                    onClick={this.handleItemClick}
                  >
                    Preferências
                  </Button>
                </Button.Group>
              )}
            </>
          )}

          {this.state.activeItem === "geral" && <General />}
          {this.state.activeItem === "servicos" && <Services />}
          {this.state.activeItem === "horarios" && (
            <div className="profile-schedule" />
          )}
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
