import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Card, Icon, Button, Divider, Form } from "semantic-ui-react";
import moment from "moment";
import calendarLocale from "../../config/CalendarLocale";
import { setCurrentPage, setEmployee } from "../dashboardActions";
import "./Profile.css";
import Axios from "axios";

// Locale file for moment
moment.locale("pt-br", calendarLocale);

const genderOptions = [
  { key: "f", text: "Feminino", value: "F" },
  { key: "m", text: "Masculino", value: "M" },
  { key: "o", text: "Outro", value: "O" }
];

const stateOptions = [
  { key: "Acre", text: "Acre", value: "Acre" },
  { key: "Alagoas", text: "Alagoas", value: "Alagoas" },
  { key: "Amapá", text: "Amapá", value: "Amapá" },
  { key: "Amazonas", text: "Amazonas", value: "Amazonas" },
  { key: "Bahia", text: "Bahia", value: "Bahia" },
  { key: "Ceará", text: "Ceará", value: "Ceará" },
  {
    key: "Distrito Federal",
    text: "Distrito Federal",
    value: "Distrito Federal"
  },
  { key: "Espírito Santo", text: "Espírito Santo", value: "Espírito Santo" },
  { key: "Goiás", text: "Goiás", value: "Goiás" },
  { key: "Maranhão", text: "Maranhão", value: "Maranhão" },
  { key: "Mato Grosso", text: "Mato Grosso", value: "Mato Grosso" },
  {
    key: "Mato Grosso do Sul",
    text: "Mato Grosso do Sul",
    value: "Mato Grosso do Sul"
  },
  { key: "Minas Gerais", text: "Minas Gerais", value: "Minas Gerais" },
  { key: "Pará", text: "Pará", value: "Pará" },
  { key: "Paraíba", text: "Paraíba", value: "Paraíba" },
  { key: "Paraná", text: "Paraná", value: "Paraná" },
  { key: "Pernambuco", text: "Pernambuco", value: "Pernambuco" },
  { key: "Piauí", text: "Piauí", value: "Piauí" },
  { key: "Rio de Janeiro", text: "Rio de Janeiro", value: "Rio de Janeiro" },
  {
    key: "Rio Grande do Norte",
    text: "Rio Grande do Norte",
    value: "Rio Grande do Norte"
  },
  {
    key: "Rio Grande do Sul",
    text: "Rio Grande do Sul",
    value: "Rio Grande do Sul"
  },
  { key: "Rondônia", text: "Rondônia", value: "Rondônia" },
  { key: "Roraima", text: "Roraima", value: "Roraima" },
  { key: "Santa Catarina", text: "Santa Catarina", value: "Santa Catarina" },
  { key: "São Paulo", text: "São Paulo", value: "São Paulo" },
  { key: "Sergipe", text: "Sergipe", value: "Sergipe" },
  { key: "Tocantins", text: "Tocantins", value: "Tocantins" }
];

class Profile extends Component {
  state = {
    activeItem: "geral",
    editGeneral: true,
    user: undefined,
    employee: undefined
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleValue = (e, { id, value }) => {
    let _value = "";
    let _id = "";
    if (!e.currentTarget.value) {
      _value = value;
      _id = id;
    } else {
      _value = e.currentTarget.value;
      _id = e.currentTarget.id;
    }

    this.setState({
      user: {
        ...this.state.user,
        [_id]: _value
      }
    });
  };

  handleAddressValue = (e, { id, value }) => {
    let _value = "";
    let _id = "";
    if (!e.currentTarget.value) {
      _value = value;
      _id = id;
    } else {
      _value = e.currentTarget.value;
      _id = e.currentTarget.id;
    }

    this.setState({
      user: {
        ...this.state.user,
        address: {
          ...this.state.user.address,
          [_id]: _value
        }
      }
    });
  };

  mapRole = role => {
    switch (role) {
      case "owner":
        return "Administrador";
      case "manager":
        return "Gerente";
      case "supervisor":
        return "Supervisor";
      case "employee":
        return this.props.employee === undefined
          ? ""
          : this.props.employee.title;
      default:
        break;
    }
  };

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

  buscaCEP = e => {
    console.log(e.currentTarget.value);
    Axios.get(`http://viacep.com.br/ws/${e.currentTarget.value}/json/`)
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      });
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

  componentDidUpdate() {
    if (this.state.user === undefined) {
      this.setState({ user: this.props.user, employee: this.props.employee });
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

          {this.state.activeItem === "geral" && (
            <div className="profile-general">
              <div className="profile-general-inner">
                {!this.state.editGeneral &&
                  (this.props.user !== undefined && (
                    <>
                      <Card>
                        <Image
                          src={
                            this.props.user === undefined
                              ? ""
                              : this.props.user.avatar
                          }
                          className="profile-avatar-img"
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
                              : this.mapRole(this.props.user.role)}
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                          <a href="/change-picture">
                            <Icon name="photo" />
                            Alterar imagem
                          </a>
                        </Card.Content>
                      </Card>
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
                            <span className="profile-details-label">
                              Email:
                            </span>{" "}
                            {this.props.user.email}
                          </li>
                        </ul>
                      </div>
                    </>
                  ))}
                {this.state.editGeneral && (
                  <div className="profile-general-edit">
                    <Form>
                      <div className="profile-form-header">Dados pessoais</div>
                      <Form.Group widths="4">
                        <Form.Input
                          fluid
                          label="Nome"
                          placeholder="Nome"
                          required
                          onChange={this.handleValue}
                          id="firstName"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.firstName
                              : ""
                          }
                        />
                        <Form.Input
                          fluid
                          label="Sobrenome"
                          placeholder="Sobrenome"
                          required
                          onChange={this.handleValue}
                          id="lastName"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.lastName
                              : ""
                          }
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Select
                          fluid
                          label="Sexo"
                          options={genderOptions}
                          placeholder="Sexo"
                          required
                          width="2"
                          onChange={this.handleValue}
                          id="gender"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.gender
                              : ""
                          }
                        />
                        <Form.Input
                          fluid
                          label="Email"
                          placeholder="Email"
                          required
                          width="6"
                          onChange={this.handleValue}
                          id="email"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.email
                              : ""
                          }
                        />
                      </Form.Group>
                      <div className="profile-form-header">Endereço</div>
                      <Form.Group />
                      <Form.Group>
                        <Form.Input
                          fluid
                          label="Logradouro"
                          placeholder="Logradouro"
                          width="4"
                          onChange={this.handleAddressValue}
                          id="street"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.address.street
                              : ""
                          }
                        />
                        <Form.Input
                          fluid
                          label="Número"
                          placeholder="Número"
                          width="2"
                          onChange={this.handleAddressValue}
                          id="number"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.address.number
                              : ""
                          }
                        />
                        <Form.Input
                          fluid
                          label="CEP"
                          placeholder="CEP"
                          width="2"
                          onChange={this.handleAddressValue}
                          id="postalCode"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.address.postalCode
                              : ""
                          }
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Input
                          fluid
                          label="Bairro"
                          placeholder="Bairro"
                          width="4"
                          onChange={this.handleAddressValue}
                          id="neighborhood"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.address.neighborhood
                              : ""
                          }
                        />
                        <Form.Input
                          fluid
                          label="Cidade"
                          placeholder="Cidade"
                          width="4"
                          onChange={this.handleAddressValue}
                          id="city"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.address.city
                              : ""
                          }
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Select
                          fluid
                          label="Estado"
                          options={stateOptions}
                          placeholder="Estado"
                          width="4"
                          onChange={this.handleAddressValue}
                          id="state"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.address.state
                              : ""
                          }
                        />
                        <Form.Input
                          fluid
                          label="País"
                          placeholder="País"
                          width="4"
                          onChange={this.handleAddressValue}
                          id="country"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.address.country
                              : ""
                          }
                        />
                      </Form.Group>
                    </Form>
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
    employee: state.dashboard.employee,
    currentPage: state.dashboard.currentPage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage)),
    setEmployee: employee => dispatch(setEmployee(employee))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
