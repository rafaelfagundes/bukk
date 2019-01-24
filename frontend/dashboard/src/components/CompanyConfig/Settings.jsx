import React, { Component } from "react";
import { connect } from "react-redux";
import { SketchPicker } from "react-color";
import {
  setCurrentPage,
  setCompany,
  setCompanyLogo
} from "../dashboardActions";
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

export class Settings extends Component {
  state = {
    company: undefined
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

  addRule = e => {
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

  render() {
    return (
      <div>
        {this.state.company !== undefined && (
          <>
            <div className="Settings">
              <Form>
                <FormTitle text="Cores" first />
                <div className="company-colors-settings">
                  <div className="company-colors-group">
                    <FormSubTitle first text="Primária" />
                    <div className="company-colors-container">
                      <span className="company-colors-label">Fundo:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .primary
                        }}
                        className="company-colors-color"
                      />
                      <Button icon="eye dropper" onClick={this.colorPicker} />
                    </div>
                    <div className="company-colors-container">
                      <span className="company-colors-label">Fonte:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .contrastColor
                        }}
                        className="company-colors-color"
                      />
                      <Button icon="eye dropper" onClick={this.colorPicker} />
                    </div>
                  </div>
                  <div className="company-colors-group">
                    <FormSubTitle first text="Secundária" />
                    <div className="company-colors-container">
                      <span className="company-colors-label">Fundo:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .secondary
                        }}
                        className="company-colors-color"
                      />
                      <Button icon="eye dropper" onClick={this.colorPicker} />
                    </div>
                  </div>
                  <div className="company-colors-group">
                    <FormSubTitle first text="Cor do Cabeçalho" />
                    <div className="company-colors-container">
                      <span className="company-colors-label">Fundo:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .header
                        }}
                        className="company-colors-color"
                      />
                      <Button icon="eye dropper" onClick={this.colorPicker} />
                    </div>
                  </div>
                  <div className="company-colors-group">
                    <FormSubTitle first text="Botões de Confirmação" />
                    <div className="company-colors-container">
                      <span className="company-colors-label">Fundo:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .confirmation
                        }}
                        className="company-colors-color"
                      />
                      <Button icon="eye dropper" onClick={this.colorPicker} />
                    </div>
                    <div className="company-colors-container">
                      <span className="company-colors-label">Fonte:</span>
                      <div
                        style={{
                          backgroundColor: this.state.company.settings.colors
                            .confirmationContrastColor
                        }}
                        className="company-colors-color"
                      />
                      <Button icon="eye dropper" onClick={this.colorPicker} />
                    </div>
                  </div>
                </div>
                {/* <pre>
                  colors:{" "}
                  {JSON.stringify(this.state.company.settings.colors, null, 2)}
                </pre> */}
                <FormTitle text="Opções de Layout" />
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
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        toggle
                        label="Logotipo quadrado"
                        onChange={this.toggleOption}
                        id="squareLogo"
                        checked={this.state.company.settings.options.squareLogo}
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
                            onClick={this.removeRule}
                            id={"rule-" + index}
                          />
                        }
                        placeholder="Nova regra"
                      />
                    </FormField>
                  )
                )}
                <Button onClick={this.addRule}>Adicionar nova regra</Button>
                <Divider style={{ marginTop: "40px" }} />
                <Button icon labelPosition="left" color="green" type="submit">
                  <Icon name="cloud" />
                  Salvar
                </Button>
              </Form>
            </div>
          </>
        )}
        {!this.state.company && <span>no company</span>}
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
    setCompany: company => dispatch(setCompany(company)),
    setCompanyLogo: logo => dispatch(setCompanyLogo(logo))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
