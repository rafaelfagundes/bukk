import React, { Component } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import Spinner from "react-spinkit";
import {
  Image,
  Card,
  Icon,
  Button,
  Divider,
  Form,
  Label
} from "semantic-ui-react";
import moment from "moment";
import MaskedInput from "react-text-mask";
import calendarLocale from "../../config/CalendarLocale";
import {
  setCurrentPage,
  setEmployee,
  setUser,
  setUserAvatar
} from "../dashboardActions";
import "./Profile.css";
import Axios from "axios";
import config from "../../config";
import { formatCEP, formatBrazilianPhoneNumber } from "../utils";
import { states } from "../../config/BrasilAddress";
import validator from "validator";
import { isAlpha, isAlphaNumeric } from "../validation";
import Notification from "../Notification/Notification";
import FormTitle from "../Common/FormTitle";

// Locale file for moment
moment.locale("pt-br", calendarLocale);

const genderOptions = [
  { key: "f", text: "Feminino", value: "F" },
  { key: "m", text: "Masculino", value: "M" },
  { key: "o", text: "Outro", value: "O" }
];

class Profile extends Component {
  state = {
    activeItem: "geral",
    page: "general",
    user: undefined,
    employee: undefined,
    loading: false,
    errors: {
      firstName: { msg: "", error: false },
      lastName: { msg: "", error: false },
      birthday: { msg: "", error: false },
      addressNumber: { msg: "", error: false },
      addressCEP: { msg: "", error: false },
      phone: { msg: "", error: false },
      workTitle: { msg: "", error: false }
    },
    loadingAvatarUpload: false,
    password: {
      actual: "",
      new: "",
      confirmation: "",
      error: {
        error: false,
        msg: ""
      }
    }
  };

  validateGeneral = () => {
    let errorsCount = 0;
    let _errors = {
      firstName: { msg: "", error: false },
      lastName: { msg: "", error: false },
      birthday: { msg: "", error: false },
      addressNumber: { msg: "", error: false },
      addressCEP: { msg: "", error: false },
      phone: { msg: "", error: false },
      workTitle: { msg: "", error: false }
    };

    if (validator.isEmpty(String(this.state.user.firstName))) {
      errorsCount++;
      _errors.firstName.msg = "Por favor, preencha o nome.";
      _errors.firstName.error = true;
    }
    if (!isAlpha(String(this.state.user.firstName.replace(/\s/g, "")))) {
      errorsCount++;
      _errors.firstName.msg =
        "Nome inválido. Por favor, preencha somente letras.";
      _errors.firstName.error = true;
    }

    if (validator.isEmpty(String(this.state.user.lastName))) {
      errorsCount++;
      _errors.lastName.msg = "Por favor, preencha o sobrenome.";
      _errors.lastName.error = true;
    }

    if (!isAlpha(String(this.state.user.lastName.replace(/\s/g, "")))) {
      errorsCount++;
      _errors.lastName.msg =
        "Sobrenome inválido. Por favor, preencha somente letras.";
      _errors.lastName.error = true;
    }

    if (validator.isEmpty(String(this.state.user.birthday))) {
      errorsCount++;
      _errors.birthday.msg = "Por favor, preencha a data de nascimento.";
      _errors.birthday.error = true;
    }

    if (!moment(this.state.user.birthday).isValid()) {
      errorsCount++;
      _errors.birthday.msg = "Data de nascimento inválida.";
      _errors.birthday.error = true;
    }

    if (
      this.state.user.phone.length < 10 ||
      this.state.user.phone.length > 11
    ) {
      errorsCount++;
      _errors.phone.msg = "O telefone deve conter 10 ou 11 algarismos.";
      _errors.phone.error = true;
    }

    if (this.state.user.address.postalCode.length !== 8) {
      if (this.state.user.address.postalCode.length > 0) {
        errorsCount++;
        _errors.addressCEP.msg = "O CEP deve conter 8 algarismos.";
        _errors.addressCEP.error = true;
      }
    }

    if (!isAlphaNumeric(this.state.user.address.number.replace(/\s/g, ""))) {
      errorsCount++;
      _errors.addressNumber.msg =
        "O número da residência deve conter somente letras e números.";
      _errors.addressNumber.error = true;
    }

    if (this.state.user.role === "employee") {
      if (validator.isEmpty(this.state.employee.title)) {
        errorsCount++;
        _errors.workTitle.msg = "Por favor, preencha o cargo.";
        _errors.workTitle.error = true;
      }
    }

    if (errorsCount === 0) {
      return true;
    } else {
      this.setState({
        errors: _errors
      });
      return false;
    }
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleUser = (e, { id, value }) => {
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

  handlePassword = (e, { id, value }) => {
    let _value = e.currentTarget.value;
    let _id = e.currentTarget.id;

    this.setState({
      password: {
        ...this.state.password,
        [_id]: _value
      }
    });
  };

  changePassword = () => {
    this.setState({ loading: true });
    let errorsCount = 0;
    if (validator.isEmpty(this.state.password.confirmation)) {
      errorsCount++;
      this.setState({
        password: {
          ...this.state.password,
          error: {
            error: true,
            msg: "Por favor, preencha a confirmação de senha."
          }
        }
      });
    }
    if (validator.isEmpty(this.state.password.new)) {
      errorsCount++;
      this.setState({
        password: {
          ...this.state.password,
          error: {
            error: true,
            msg: "Por favor, preencha a nova senha."
          }
        }
      });
    }
    if (validator.isEmpty(this.state.password.actual)) {
      errorsCount++;
      this.setState({
        password: {
          ...this.state.password,
          error: {
            error: true,
            msg: "Por favor, preencha a senha atual."
          }
        }
      });
    }

    if (this.state.password.new.length < 6) {
      errorsCount++;
      this.setState({
        password: {
          ...this.state.password,
          error: {
            error: true,
            msg: "A nova senha deve conter no mínimo 6 caracteres."
          }
        }
      });
    }
    if (this.state.password.new === this.state.password.actual) {
      errorsCount++;
      this.setState({
        password: {
          ...this.state.password,
          error: {
            error: true,
            msg: "A nova senha deve ser diferente da atual."
          }
        }
      });
    }

    if (this.state.password.confirmation !== this.state.password.new) {
      errorsCount++;
      this.setState({
        password: {
          ...this.state.password,
          error: {
            error: true,
            msg: "A nova senha e a confirmação não coincidem."
          }
        }
      });
    }

    if (errorsCount > 0) {
      return false;
    } else {
      const token = localStorage.getItem("token");
      let requestConfig = {
        headers: {
          Authorization: token
        }
      };
      Axios.post(
        config.api + "/users/changePassword",
        this.state.password,
        requestConfig
      )
        .then(response => {
          toast(
            <Notification
              type="success"
              title="Senha atualizada com sucesso"
              text="A senha foi atualizada com sucesso."
            />
          );
          this.setState({ loading: false, page: "general" });
        })
        .catch(error => {
          this.setState({
            loading: false,
            password: {
              ...this.state.password,
              error: {
                error: true,
                msg: error.response.data.msg
              }
            }
          });
        });
    }
  };

  handleUserBirthday = e => {
    try {
      if (e.currentTarget.value.indexOf("_") < 0) {
        const birthday = moment(e.currentTarget.value, "DD/MM/YYYY");
        this.setState({
          user: {
            ...this.state.user,
            birthday: birthday.toDate()
          }
        });
      }
    } catch (error) {}
  };

  handleUserPhone = e => {
    const phone = e.currentTarget.value.replace(/\D+/g, "");

    this.setState({
      user: {
        ...this.state.user,
        phone
      }
    });
  };

  handleEmployee = (e, { id, value }) => {
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
      employee: {
        ...this.state.employee,
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

  handleAddressCEP = (e, { id, value }) => {
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

  handleAvatarImage = e => {
    this.setState({ loadingAvatarUpload: true });
    ReactDOM.findDOMNode(this.refs.formAvatarImage).dispatchEvent(
      new Event("submit")
    );
  };

  submitAvatarImage = e => {
    const data = new FormData(e.target);
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };
    Axios.post(config.api + "/images/avatar", data, requestConfig)
      .then(response => {
        this.props.setUserAvatar({
          avatar: response.data.avatarUrl
        });
        this.setState({ user: this.props.user, loadingAvatarUpload: false });
        localStorage.setItem("user", JSON.stringify(this.props.user));
        toast(
          <Notification
            type="success"
            title="Imagem atualizada com sucesso"
            text="A imagem está salva no servidor."
          />
        );
      })
      .catch(err => {
        toast(
          <Notification
            type="error"
            title="Erro ao atualizar imagem"
            text={err.response.data.msg}
          />
        );
      });
    e.target.reset();
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
    this.setState({
      page: "editProfile",
      errors: {
        firstName: { msg: "", error: false },
        lastName: { msg: "", error: false },
        birthday: { msg: "", error: false },
        addressNumber: { msg: "", error: false },
        addressCEP: { msg: "", error: false },
        phone: { msg: "", error: false },
        workTitle: { msg: "", error: false }
      }
    });
  };

  changePasswordPage = () => {
    this.setState({ page: "changePassword" });
  };

  generalPage = () => {
    this.setState({ page: "general" });
  };

  saveGeneral = () => {
    if (!this.validateGeneral()) {
      return false;
    }
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.patch(config.api + "/users/update", this.state.user, requestConfig)
      .then(response => {
        if (response.data.ok === 1) {
          localStorage.setItem("user", JSON.stringify(this.state.user));
          this.props.setUser(this.state.user);
          if (this.state.user.role === "employee") {
            Axios.patch(
              config.api + "/specialists/update",
              this.state.employee,
              requestConfig
            )
              .then(response => {
                if (response.data.ok === 1) {
                  localStorage.setItem(
                    "employee",
                    JSON.stringify(this.state.employee)
                  );
                  this.props.setEmployee(this.state.employee);
                  toast(
                    <Notification
                      type="success"
                      title="Informações atualizadas"
                      text="As novas informações foram salvas com sucesso. "
                    />
                  );
                }
              })
              .catch(err => {
                toast(
                  <Notification
                    type="error"
                    title="Erro ao atualizar informações"
                    text="Houve um erro ao atualizar as informações. Tente novamente."
                  />
                );
              });
          } else {
            toast(
              <Notification
                type="success"
                title="Informações atualizadas"
                text="As novas informações foram salvas com sucesso. "
              />
            );
          }
        }
      })
      .catch(error => {
        toast(
          <Notification
            type="error"
            title="Erro ao atualizar informações"
            text="Houve um erro ao atualizar as informações. Tente novamente."
          />
        );
      });

    this.setState({ page: "general" });
  };

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

          {this.state.activeItem === "geral" && (
            <div className="profile-general">
              <div className="profile-general-inner">
                {this.state.page === "general" &&
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
                        <Card.Content extra className="profile-card-links">
                          <Form
                            onSubmit={this.submitAvatarImage}
                            id="form-avatar-image"
                            ref="formAvatarImage"
                          >
                            <Label
                              as="label"
                              htmlFor="avatar-image"
                              size="large"
                              className="profile-card-link"
                            >
                              {!this.state.loadingAvatarUpload && (
                                <Icon name="photo" />
                              )}
                              {this.state.loadingAvatarUpload && (
                                <Icon
                                  name="asterisk"
                                  className="image-upload-spinner"
                                />
                              )}
                              Alterar imagem
                            </Label>
                            <input
                              id="avatar-image"
                              name="avatar-image"
                              hidden
                              type="file"
                              onChange={this.handleAvatarImage}
                            />
                          </Form>
                          <Button
                            className="profile-card-password-change"
                            onClick={this.changePasswordPage}
                          >
                            <Icon name="key" />
                            Alterar senha
                          </Button>
                        </Card.Content>
                      </Card>
                      <div className="profile-general-view">
                        <FormTitle first text="Endereço" />
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
                          <li>
                            {formatCEP(this.props.user.address.postalCode)}
                          </li>
                        </ul>
                        <FormTitle text="Contato" />
                        <ul>
                          <li>
                            <span className="profile-details-label">
                              Email:
                            </span>{" "}
                            {this.props.user.email}
                          </li>
                          <li>
                            <span className="profile-details-label">
                              Telefone:
                            </span>{" "}
                            {formatBrazilianPhoneNumber(this.props.user.phone)}
                          </li>
                        </ul>
                        <FormTitle text="Outros" />
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
                        </ul>
                      </div>
                    </>
                  ))}
                {this.state.page === "changePassword" && (
                  <div className="profile-change-password">
                    <FormTitle first text="Alterar Senha" />
                    <Form
                      className="change-password-form"
                      onSubmit={this.changePassword}
                    >
                      <Form.Group widths="8">
                        <Form.Input
                          label="Senha atual"
                          type="password"
                          width="8"
                          id="actual"
                          onChange={this.handlePassword}
                          value={this.state.password.actual}
                          required
                        />
                      </Form.Group>
                      <Form.Group widths="8">
                        <Form.Input
                          label="Nova senha"
                          type="password"
                          width="8"
                          id="new"
                          onChange={this.handlePassword}
                          value={this.state.password.new}
                          required
                        />
                      </Form.Group>
                      <Form.Group widths="8">
                        <Form.Input
                          label="Confirme a nova senha"
                          type="password"
                          width="8"
                          id="confirmation"
                          onChange={this.handlePassword}
                          value={this.state.password.confirmation}
                          required
                        />
                      </Form.Group>
                    </Form>
                    {this.state.password.error.error && (
                      <div className="profile-form-error">
                        {this.state.password.error.msg}
                      </div>
                    )}
                  </div>
                )}
                {this.state.page === "editProfile" && (
                  <div className="profile-general-edit">
                    <Form>
                      <FormTitle text="Dados pessoais" first />
                      <Form.Group widths="4">
                        <Form.Input
                          fluid
                          label="Nome"
                          placeholder="Nome"
                          required
                          onChange={this.handleUser}
                          id="firstName"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.firstName
                              : ""
                          }
                          error={this.state.errors.firstName.error}
                        />
                        <Form.Input
                          fluid
                          label="Sobrenome"
                          placeholder="Sobrenome"
                          required
                          onChange={this.handleUser}
                          id="lastName"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.lastName
                              : ""
                          }
                          error={this.state.errors.lastName.error}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Select
                          fluid
                          label="Sexo"
                          options={genderOptions}
                          placeholder="Sexo"
                          required
                          width="4"
                          onChange={this.handleUser}
                          id="gender"
                          value={
                            this.state.user !== undefined
                              ? this.state.user.gender
                              : ""
                          }
                        />

                        <div className="required three wide field">
                          <label htmlFor="birthday">Data de Nascimento</label>
                          <MaskedInput
                            mask={[
                              /\d/,
                              /\d/,
                              "/",
                              /\d/,
                              /\d/,
                              "/",
                              /\d/,
                              /\d/,
                              /\d/,
                              /\d/
                            ]}
                            name="birthday"
                            id="birthday"
                            onChange={this.handleUserBirthday}
                            value={
                              this.state.user !== undefined
                                ? moment(this.state.user.birthday).format(
                                    "DD/MM/YYYY"
                                  )
                                : ""
                            }
                          />
                        </div>
                      </Form.Group>
                      {this.state.errors.firstName.error && (
                        <div className="profile-form-error">
                          {this.state.errors.firstName.msg}
                        </div>
                      )}
                      {this.state.errors.lastName.error && (
                        <div className="profile-form-error">
                          {this.state.errors.lastName.msg}
                        </div>
                      )}
                      {this.state.errors.birthday.error && (
                        <div className="profile-form-error">
                          {this.state.errors.birthday.msg}
                        </div>
                      )}

                      <FormTitle text="Endereço e Contato" />
                      <Form.Group>
                        <Form.Input
                          fluid
                          label="Telefone"
                          placeholder="Telefone"
                          width="4"
                          onChange={this.handleUserPhone}
                          id="phone"
                          value={
                            this.state.user !== undefined
                              ? formatBrazilianPhoneNumber(
                                  this.state.user.phone
                                )
                              : ""
                          }
                          error={this.state.errors.phone.error}
                        />
                      </Form.Group>
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
                              ? formatCEP(this.state.user.address.postalCode)
                              : ""
                          }
                          error={this.state.errors.addressCEP.error}
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
                      </Form.Group>
                      <Form.Group>
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
                        <Form.Select
                          fluid
                          label="Estado"
                          options={states}
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
                      </Form.Group>
                      {this.state.errors.phone.error && (
                        <div className="profile-form-error">
                          {this.state.errors.phone.msg}
                        </div>
                      )}

                      {this.state.errors.addressNumber.error && (
                        <div className="profile-form-error">
                          {this.state.errors.addressNumber.msg}
                        </div>
                      )}
                      {this.state.errors.addressCEP.error && (
                        <div className="profile-form-error">
                          {this.state.errors.addressCEP.msg}
                        </div>
                      )}
                      {this.state.errors.addressCEP.error && (
                        <div className="profile-form-error">
                          {this.state.errors.addressNumber.msg}
                        </div>
                      )}

                      {this.state.user !== undefined && (
                        <>
                          {this.state.user.role === "employee" && (
                            <>
                              <div className="profile-form-header">
                                Dados profissionais
                              </div>
                              <Form.Group>
                                <Form.Input
                                  fluid
                                  required
                                  label="Cargo / Função / Habilidade"
                                  placeholder="Cargo"
                                  width="8"
                                  onChange={this.handleEmployee}
                                  id="title"
                                  value={
                                    this.state.employee !== undefined
                                      ? this.state.employee.title
                                      : ""
                                  }
                                />
                              </Form.Group>
                              {this.state.errors.workTitle.error && (
                                <div className="profile-form-error">
                                  {this.state.errors.workTitle.msg}
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </Form>
                  </div>
                )}
              </div>
              <Divider style={{ marginTop: "40px" }} />
              {this.state.page === "general" && (
                <Button icon labelPosition="left" onClick={this.editGeneral}>
                  <Icon name="pencil" />
                  Editar Informações
                </Button>
              )}
              {this.state.page === "editProfile" && (
                <>
                  <Button
                    icon
                    labelPosition="left"
                    color="green"
                    onClick={this.saveGeneral}
                  >
                    <Icon name="cloud" />
                    Salvar
                  </Button>
                  {this.state.loading && (
                    <Spinner
                      style={{
                        top: "6px",
                        left: "5px",
                        display: "inline-block"
                      }}
                      name="circle"
                      color={
                        this.props.company
                          ? this.props.company.settings.colors.primaryBack
                          : ""
                      }
                    />
                  )}
                </>
              )}
              {this.state.page === "changePassword" && (
                <>
                  <Button
                    icon
                    labelPosition="left"
                    color="green"
                    onClick={this.changePassword}
                  >
                    <Icon name="key" />
                    Alterar Senha
                  </Button>
                  {this.state.loading && (
                    <Spinner
                      style={{
                        top: "6px",
                        left: "5px",
                        display: "inline-block"
                      }}
                      name="circle"
                      color={
                        this.props.company
                          ? this.props.company.settings.colors.primaryBack
                          : ""
                      }
                    />
                  )}
                </>
              )}
              {this.state.page !== "general" && (
                <Button
                  icon
                  labelPosition="left"
                  floated="right"
                  onClick={this.generalPage}
                >
                  <Icon name="cancel" />
                  Cancelar
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
    currentPage: state.dashboard.currentPage,
    company: state.dashboard.company
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage)),
    setEmployee: employee => dispatch(setEmployee(employee)),
    setUser: user => dispatch(setUser(user)),
    setUserAvatar: avatar => dispatch(setUserAvatar(avatar))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
