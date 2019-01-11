import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Card, Icon, Button, Divider } from "semantic-ui-react";
import moment from "moment";
import calendarLocale from "../../config/CalendarLocale";
import { setCurrentPage } from "../dashboardActions";
import "./Profile.css";

// Locale file for moment
moment.locale("pt-br", calendarLocale);

const mapRole = role => {
  switch (role) {
    case "owner":
      return "Administrador";
    case "manager":
      return "Gerente";
    case "supervisor":
      return "Supervisor";
    default:
      break;
  }
};

class Profile extends Component {
  state = {
    activeItem: "geral",
    editGeneral: false
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  formatCEP = cep => {
    const c = String(cep);
    return c[0] + c[1] + c[2] + c[3] + c[4] + "-" + c[5] + c[6] + c[7];
  };

  formatGender = gender => {
    switch (gender) {
      case "M":
        return "Masculino";
      case "F":
        return "Feminino";
      default:
        return "Outro";
    }
  };

  editGeneral = () => {
    this.setState({ editGeneral: true });
  };

  saveGeneral = () => {
    this.setState({ editGeneral: false });
  };

  componentDidMount() {
    this.props.setCurrentPage({
      title: "Perfil",
      icon: "user circle"
    });
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

          {this.state.activeItem === "geral" && (
            <div className="profile-general">
              <div className="profile-general-inner">
                <Card>
                  <Image
                    src={
                      this.props.user === undefined
                        ? ""
                        : this.props.user.avatar
                    }
                  />
                  <Card.Content>
                    <Card.Header>
                      {this.props.user === undefined
                        ? ""
                        : this.props.user.firstName +
                          " " +
                          this.props.user.lastName}
                    </Card.Header>
                    <Card.Meta>
                      <span className="date">
                        {this.props.user === undefined
                          ? ""
                          : "Entrou em " +
                            moment(this.props.user.createdAt).format(
                              "MMMM [de] YYYY"
                            )}
                      </span>
                    </Card.Meta>
                    <Card.Description>
                      {this.props.user === undefined
                        ? ""
                        : mapRole(this.props.user.role)}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <a href="/change-picture">
                      <Icon name="photo" />
                      Alterar imagem
                    </a>
                  </Card.Content>
                </Card>
                {!this.state.editGeneral &&
                  (this.props.user !== undefined && (
                    <div className="profile-general-view">
                      <h2>Endereço</h2>
                      <ul>
                        <li>
                          {this.props.user.address.street},{" "}
                          {this.props.user.address.number}
                        </li>
                        <li>{this.props.user.address.neighborhood}</li>
                        <li>
                          {this.props.user.address.city} -{" "}
                          {this.props.user.address.state}
                        </li>
                        <li>{this.props.user.address.country}</li>
                        <li>
                          {this.formatCEP(this.props.user.address.postalCode)}
                        </li>
                      </ul>
                      <h2>Outros</h2>
                      <ul>
                        <li>
                          <span className="profile-details-label">Sexo:</span>{" "}
                          {this.formatGender(this.props.user.gender)}
                        </li>
                        <li>
                          <span className="profile-details-label">
                            Aniversário:
                          </span>{" "}
                          {moment(this.props.user.birthday).format(
                            "DD [de] MMMM [de] YYYY"
                          )}
                        </li>

                        <li>
                          <span className="profile-details-label">Email:</span>{" "}
                          {this.props.user.email}
                        </li>
                      </ul>
                    </div>
                  ))}
                {this.state.editGeneral && (
                  <div className="profile-general-edit">
                    <h1>edit</h1>
                  </div>
                )}
              </div>
              <Divider className="profile-bottom-divider" />
              {!this.state.editGeneral && (
                <Button icon labelPosition="left" onClick={this.editGeneral}>
                  <Icon name="pencil" />
                  Editar
                </Button>
              )}
              {this.state.editGeneral && (
                <Button
                  icon
                  labelPosition="left"
                  floated="right"
                  color="green"
                  onClick={this.saveGeneral}
                >
                  <Icon name="cloud" />
                  Salvar
                </Button>
              )}
            </div>
          )}
          {this.state.activeItem === "servicos" && (
            <div className="profile-services" />
          )}
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
    currentPage: state.dashboard.currentPage
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
