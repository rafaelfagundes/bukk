import React, { Component } from "react";
import { connect } from "react-redux";
import { SketchPicker } from "react-color";
import Spinner from "react-spinkit";
import Axios from "axios";
import { toast } from "react-toastify";
import { setCompany } from "../dashboardActions";
import FormTitle from "../Common/FormTitle";
import {
  Checkbox,
  Form,
  Input,
  FormField,
  Button,
  Divider,
  Icon
} from "semantic-ui-react";
import FormSubTitle from "../Common/FormSubTitle";
import config from "../../config";
import Notification from "../Notification/Notification";

class Settings extends Component {
  state = {
    company: undefined,
    loading: false,
    colorPicker: {
      primaryBack: false,
      primaryText: false,
      secondaryBack: false,
      secondaryText: false,
      headerBack: false,
      headerText: false,
      confirmationBack: false,
      confirmationText: false
    }
  };

  componentDidMount() {
    const _company = JSON.parse(localStorage.getItem("company"));
    this.setState({ company: _company });
  }

  toggleOption = e => {
    const _id = e.currentTarget.id;

    this.setState({
      company: {
        ...this.state.company,
        settings: {
          ...this.state.company.settings,
          options: {
            ...this.state.company.settings.options,
            [_id]: !this.state.company.settings.options[_id]
          }
        }
      }
    });
  };

  handleRule = e => {
    let _rules = this.state.company.settings.appointment.rules;
    const _index = e.currentTarget.id.replace("index-", "");
    _rules[_index] = e.currentTarget.value;

    this.setState({
      company: {
        ...this.state.company,
        settings: {
          ...this.state.company.settings,
          appointment: {
            ...this.state.company.settings.appointment,
            rules: _rules
          }
        }
      }
    });
  };

  addRule = e => {
    e.preventDefault();
    this.setState({
      company: {
        ...this.state.company,
        settings: {
          ...this.state.company.settings,
          appointment: {
            ...this.state.company.settings.appointment,
            rules: [...this.state.company.settings.appointment.rules, ""]
          }
        }
      }
    });
  };

  removeRule = e => {
    const _id = Number(e.currentTarget.id.replace("rule-", ""));

    let _rules = JSON.parse(
      JSON.stringify(this.state.company.settings.appointment.rules)
    );
    _rules.splice(_id, 1);

    this.setState({
      company: {
        ...this.state.company,
        settings: {
          ...this.state.company.settings,
          appointment: {
            ...this.state.company.settings.appointment,
            rules: _rules
          }
        }
      }
    });
  };

  handleColorChange = (color, id) => {
    this.setState({
      company: {
        ...this.state.company,
        settings: {
          ...this.state.company.settings,
          colors: {
            ...this.state.company.settings.colors,
            [id]: color.hex
          }
        }
      }
    });
  };

  handleColorPrimaryBack = color => {
    this.handleColorChange(color, "primaryBack");
  };
  handleColorPrimaryText = color => {
    this.handleColorChange(color, "primaryText");
  };
  handleColorSecondaryBack = color => {
    this.handleColorChange(color, "secondaryBack");
  };
  handleColorSecondaryText = color => {
    this.handleColorChange(color, "secondaryText");
  };
  handleColorHeaderBack = color => {
    this.handleColorChange(color, "headerBack");
  };
  handleColorHeaderText = color => {
    this.handleColorChange(color, "headerText");
  };
  handleColorConfirmationBack = color => {
    this.handleColorChange(color, "confirmationBack");
  };
  handleColorConfirmationText = color => {
    this.handleColorChange(color, "confirmationText");
  };

  colorPickerToggle = e => {
    e.preventDefault();
    const _id = e.currentTarget.id;
    this.setState({
      colorPicker: {
        ...this.state.colorPicker,
        [_id]: !this.state.colorPicker[_id]
      }
    });
  };

  colorPickerClose = e => {
    const _id = e.currentTarget.dataset.id;
    this.setState({
      colorPicker: {
        ...this.state.colorPicker,
        [_id]: false
      }
    });
  };

  validate = e => {
    let _rules = [];

    this.state.company.settings.appointment.rules.forEach(rule => {
      if (rule !== "") {
        _rules.push(rule);
      }
    });

    this.setState({
      company: {
        ...this.state.company,
        settings: {
          ...this.state.company.settings,
          appointment: {
            ...this.state.company.settings.appointment,
            rules: _rules
          }
        }
      }
    });
    return true;
  };

  saveSettings = e => {
    this.setState({ loading: true });
    e.preventDefault();
    if (!this.validate()) {
      return false;
    }

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/companies/update",
      this.state.company,
      requestConfig
    )
      .then(response => {
        toast(
          <Notification
            type="success"
            title="Dados atualizados com sucesso"
            text="Os dados da empresa foram atualizados"
          />
        );
        this.props.setCompany(this.state.company);
        localStorage.setItem("company", JSON.stringify(this.state.company));
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ loading: false });
        toast(
          <Notification
            type="error"
            title="Erro ao atualizar dados da empresa"
            text={err.response.data.msg}
          />
        );
      });
  };

  render() {
    return (
      <div>
        {this.state.company !== undefined && (
          <>
            <div className="Settings">
              <Form onSubmit={this.saveSettings}>
                <FormTitle text="Cores" first />
                <div className="company-colors-settings">
                  <div className="company-colors-group">
                    <FormSubTitle first text="Primária" />
                    <div className="company-colors-container">
                      <span className="company-colors-label">Fundo:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .primaryBack
                        }}
                        className="company-colors-color"
                      />

                      <Button
                        icon={
                          this.state.colorPicker.primaryBack
                            ? "delete"
                            : "eye dropper"
                        }
                        onClick={this.colorPickerToggle}
                        id="primaryBack"
                        style={{
                          backgroundColor: this.state.colorPicker.primaryBack
                            ? "#db2828"
                            : "",
                          color: this.state.colorPicker.primaryBack
                            ? "#FFF"
                            : ""
                        }}
                      />
                    </div>
                    {this.state.colorPicker.primaryBack && (
                      <div className="popover">
                        <div
                          className="cover"
                          onClick={this.colorPickerClose}
                          data-id="primaryBack"
                        />
                        <SketchPicker
                          className="color-picker"
                          color={this.state.company.settings.colors.primaryBack}
                          onChange={this.handleColorPrimaryBack}
                        />
                      </div>
                    )}
                    <div className="company-colors-container">
                      <span className="company-colors-label">Texto:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .primaryText
                        }}
                        className="company-colors-color"
                      />
                      <Button
                        icon={
                          this.state.colorPicker.primaryText
                            ? "delete"
                            : "eye dropper"
                        }
                        onClick={this.colorPickerToggle}
                        id="primaryText"
                        style={{
                          backgroundColor: this.state.colorPicker.primaryText
                            ? "#db2828"
                            : "",
                          color: this.state.colorPicker.primaryText
                            ? "#FFF"
                            : ""
                        }}
                      />
                    </div>
                    {this.state.colorPicker.primaryText && (
                      <div className="popover">
                        <div
                          className="cover"
                          onClick={this.colorPickerClose}
                          data-id="primaryText"
                        />
                        <SketchPicker
                          className="color-picker"
                          color={this.state.company.settings.colors.primaryText}
                          onChange={this.handleColorPrimaryText}
                        />
                      </div>
                    )}
                  </div>
                  <div className="company-colors-group">
                    <FormSubTitle first text="Secundária" />
                    <div className="company-colors-container">
                      <span className="company-colors-label">Fundo:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .secondaryBack
                        }}
                        className="company-colors-color"
                      />
                      <Button
                        icon={
                          this.state.colorPicker.secondaryBack
                            ? "delete"
                            : "eye dropper"
                        }
                        onClick={this.colorPickerToggle}
                        id="secondaryBack"
                        style={{
                          backgroundColor: this.state.colorPicker.secondaryBack
                            ? "#db2828"
                            : "",
                          color: this.state.colorPicker.secondaryBack
                            ? "#FFF"
                            : ""
                        }}
                      />
                    </div>
                    {this.state.colorPicker.secondaryBack && (
                      <div className="popover">
                        <div
                          className="cover"
                          onClick={this.colorPickerClose}
                          data-id="secondaryBack"
                        />
                        <SketchPicker
                          className="color-picker"
                          color={
                            this.state.company.settings.colors.secondaryBack
                          }
                          onChange={this.handleColorSecondaryBack}
                        />
                      </div>
                    )}
                    <div className="company-colors-container">
                      <span className="company-colors-label">Texto:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .secondaryText
                        }}
                        className="company-colors-color"
                      />
                      <Button
                        icon={
                          this.state.colorPicker.secondaryText
                            ? "delete"
                            : "eye dropper"
                        }
                        onClick={this.colorPickerToggle}
                        id="secondaryText"
                        style={{
                          backgroundColor: this.state.colorPicker.secondaryText
                            ? "#db2828"
                            : "",
                          color: this.state.colorPicker.secondaryText
                            ? "#FFF"
                            : ""
                        }}
                      />
                    </div>
                    {this.state.colorPicker.secondaryText && (
                      <div className="popover">
                        <div
                          className="cover"
                          onClick={this.colorPickerClose}
                          data-id="secondaryText"
                        />
                        <SketchPicker
                          className="color-picker"
                          color={
                            this.state.company.settings.colors.secondaryText
                          }
                          onChange={this.handleColorSecondaryText}
                        />
                      </div>
                    )}
                  </div>
                  <div className="company-colors-group">
                    <FormSubTitle first text="Cor do Cabeçalho" />
                    <div className="company-colors-container">
                      <span className="company-colors-label">Fundo:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .headerBack
                        }}
                        className="company-colors-color"
                      />
                      <Button
                        icon={
                          this.state.colorPicker.headerBack
                            ? "delete"
                            : "eye dropper"
                        }
                        onClick={this.colorPickerToggle}
                        id="headerBack"
                        style={{
                          backgroundColor: this.state.colorPicker.headerBack
                            ? "#db2828"
                            : "",
                          color: this.state.colorPicker.headerBack ? "#FFF" : ""
                        }}
                      />
                    </div>
                    {this.state.colorPicker.headerBack && (
                      <div className="popover">
                        <div
                          className="cover"
                          onClick={this.colorPickerClose}
                          data-id="headerBack"
                        />
                        <SketchPicker
                          className="color-picker"
                          color={this.state.company.settings.colors.headerBack}
                          onChange={this.handleColorHeaderBack}
                        />
                      </div>
                    )}
                    <div className="company-colors-container">
                      <span className="company-colors-label">Texto:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .headerText
                        }}
                        className="company-colors-color"
                      />
                      <Button
                        icon={
                          this.state.colorPicker.headerText
                            ? "delete"
                            : "eye dropper"
                        }
                        onClick={this.colorPickerToggle}
                        id="headerText"
                        style={{
                          backgroundColor: this.state.colorPicker.headerText
                            ? "#db2828"
                            : "",
                          color: this.state.colorPicker.headerText ? "#FFF" : ""
                        }}
                      />
                    </div>
                    {this.state.colorPicker.headerText && (
                      <div className="popover">
                        <div
                          className="cover"
                          onClick={this.colorPickerClose}
                          data-id="headerText"
                        />
                        <SketchPicker
                          className="color-picker"
                          color={this.state.company.settings.colors.headerText}
                          onChange={this.handleColorHeaderText}
                        />
                      </div>
                    )}
                  </div>
                  <div className="company-colors-group">
                    <FormSubTitle first text="Botões de Confirmação" />
                    <div className="company-colors-container">
                      <span className="company-colors-label">Fundo:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .confirmationBack
                        }}
                        className="company-colors-color"
                      />
                      <Button
                        icon={
                          this.state.colorPicker.confirmationBack
                            ? "delete"
                            : "eye dropper"
                        }
                        onClick={this.colorPickerToggle}
                        id="confirmationBack"
                        style={{
                          backgroundColor: this.state.colorPicker
                            .confirmationBack
                            ? "#db2828"
                            : "",
                          color: this.state.colorPicker.confirmationBack
                            ? "#FFF"
                            : ""
                        }}
                      />
                    </div>
                    {this.state.colorPicker.confirmationBack && (
                      <div className="popover">
                        <div
                          className="cover"
                          onClick={this.colorPickerClose}
                          data-id="confirmationBack"
                        />
                        <SketchPicker
                          className="color-picker"
                          color={
                            this.state.company.settings.colors.confirmationBack
                          }
                          onChange={this.handleColorConfirmationBack}
                        />
                      </div>
                    )}

                    <div className="company-colors-container">
                      <span className="company-colors-label">Texto:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .confirmationText
                        }}
                        className="company-colors-color"
                      />
                      <Button
                        icon={
                          this.state.colorPicker.confirmationText
                            ? "delete"
                            : "eye dropper"
                        }
                        onClick={this.colorPickerToggle}
                        id="confirmationText"
                        style={{
                          backgroundColor: this.state.colorPicker
                            .confirmationText
                            ? "#db2828"
                            : "",
                          color: this.state.colorPicker.confirmationText
                            ? "#FFF"
                            : ""
                        }}
                      />
                    </div>
                    {this.state.colorPicker.confirmationText && (
                      <div className="popover">
                        <div
                          className="cover"
                          onClick={this.colorPickerClose}
                          data-id="confirmationText"
                        />
                        <SketchPicker
                          className="color-picker"
                          color={
                            this.state.company.settings.colors.confirmationText
                          }
                          onChange={this.handleColorConfirmationText}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <FormTitle text="Layout do Agendador" />
                <div className="company-settings-container">
                  <div className="company-settings-group">
                    <FormSubTitle
                      first
                      text="Personalização da Interface do Agendador"
                    />
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Desabilitar margem ao topo"
                        onChange={this.toggleOption}
                        id="disableMarginTopBooker"
                        checked={
                          this.state.company.settings.options
                            .disableMarginTopBooker
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Desabilitar cabeçalho"
                        onChange={this.toggleOption}
                        id="disableHeader"
                        checked={
                          this.state.company.settings.options.disableHeader
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Remover bordas"
                        onChange={this.toggleOption}
                        id="disableBorder"
                        checked={
                          this.state.company.settings.options.disableBorder
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Remover arrendondamento de componentes"
                        onChange={this.toggleOption}
                        id="disableBorderRadius"
                        checked={
                          this.state.company.settings.options
                            .disableBorderRadius
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Mostrar sombra externa"
                        onChange={this.toggleOption}
                        id="dropShadowBooker"
                        checked={
                          this.state.company.settings.options.dropShadowBooker
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Mostrar sombras nos componentes do agendador"
                        onChange={this.toggleOption}
                        id="dropShadowComponents"
                        checked={
                          this.state.company.settings.options
                            .dropShadowComponents
                        }
                      />
                    </Form.Field>
                  </div>
                  <div className="company-settings-group">
                    <FormSubTitle first text="Logotipo" />
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Não mostrar logotipo"
                        onChange={this.toggleOption}
                        id="disableLogo"
                        checked={
                          this.state.company.settings.options.disableLogo
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Centralizar logotipo no cabeçalho"
                        onChange={this.toggleOption}
                        id="centerLogo"
                        checked={this.state.company.settings.options.centerLogo}
                        disabled={
                          this.state.company.settings.options.disableLogo
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Logotipo circular"
                        onChange={this.toggleOption}
                        id="roundedLogo"
                        checked={
                          this.state.company.settings.options.roundedLogo
                        }
                        disabled={
                          this.state.company.settings.options.disableLogo
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Logotipo quadrado"
                        onChange={this.toggleOption}
                        id="squareLogo"
                        checked={this.state.company.settings.options.squareLogo}
                        disabled={
                          this.state.company.settings.options.disableLogo
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Logotipo com cantos arredondados"
                        onChange={this.toggleOption}
                        id="softSquareLogo"
                        checked={
                          this.state.company.settings.options.softSquareLogo
                        }
                        disabled={
                          this.state.company.settings.options.disableLogo
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Inserir nome da empresa ao lado do logotipo"
                        onChange={this.toggleOption}
                        id="showCompanyNickname"
                        checked={
                          this.state.company.settings.options
                            .showCompanyNickname
                        }
                        disabled={
                          this.state.company.settings.options.disableLogo ||
                          this.state.company.settings.options.centerLogo
                        }
                      />
                    </Form.Field>
                  </div>
                </div>
                <FormTitle text="Regras de Agendamento" />
                {this.state.company.settings.appointment.rules.map(
                  (rule, index) => (
                    <FormField key={index}>
                      <Input
                        value={rule}
                        action={
                          <Button
                            color="red"
                            icon="delete"
                            inverted
                            onClick={this.removeRule}
                            id={"rule-" + index}
                          />
                        }
                        id={"index-" + index}
                        placeholder="Nova regra"
                        onChange={this.handleRule}
                      />
                    </FormField>
                  )
                )}
                <Button
                  icon="plus"
                  content="Adicionar Regra"
                  color="blue"
                  compact
                  onClick={this.addRule}
                />
                <Divider style={{ marginTop: "40px" }} />
                <Button icon labelPosition="left" color="green" type="submit">
                  <Icon name="cloud" />
                  Salvar
                </Button>
                {this.state.loading && (
                  <Spinner
                    style={{ top: "6px", left: "5px", display: "inline-block" }}
                    name="circle"
                    color={this.props.company.settings.colors.primaryBack}
                  />
                )}
              </Form>
            </div>
          </>
        )}
        {!this.state.company && (
          <span>Erro ao carregar configurações da empresa</span>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    company: state.dashboard.company
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCompany: company => dispatch(setCompany(company))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
