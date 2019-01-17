import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentPage, setCompany } from "../dashboardActions";
import { Button, Form, FormGroup, Checkbox } from "semantic-ui-react";
import Axios from "axios";
import config from "../../config";
import "./CompanyConfig.css";
import { states } from "../../config/BrasilAddress";
import { formatCEP, formatBrazilianPhoneNumber, formatCpfCnpj } from "../utils";

export class CompanyConfig extends Component {
  state = {
    activeItem: "geral",
    company: undefined,
    paymentTypes: {
      cc: {
        amex: {
          enabled: false,
          name: "American Express",
          id: "amex",
          icon:
            "https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/amex.png"
        },
        dinersClub: {
          enabled: false,
          name: "Diners Club",
          id: "dinersClub",
          icon:
            "https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/dinersclub.png"
        },
        discover: {
          enabled: false,
          name: "Discover",
          id: "discover",
          icon:
            "https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/discover.png"
        },
        elo: {
          enabled: false,
          name: "Elo",
          id: "elo",
          icon:
            "https://res.cloudinary.com/bukkapp/image/upload/v1547692316/Bukk/Assets/Payment%20Icons/elo.png"
        },
        hipercard: {
          enabled: false,
          name: "Hipercard",
          id: "hipercard",
          icon:
            "https://res.cloudinary.com/bukkapp/image/upload/v1547692316/Bukk/Assets/Payment%20Icons/hipercard.png"
        },
        masterCard: {
          enabled: false,
          name: "MasterCard",
          id: "visa",
          icon:
            "https://res.cloudinary.com/bukkapp/image/upload/v1547692316/Bukk/Assets/Payment%20Icons/mastercard.png"
        },
        visa: {
          enabled: false,
          name: "Visa",
          id: "visa",
          icon:
            "https://res.cloudinary.com/bukkapp/image/upload/v1547692316/Bukk/Assets/Payment%20Icons/visa.png"
        }
      },
      other: {
        boleto: false,
        cash: false,
        crypto: false,
        debitCard: false,
        wireTransfer: false
      }
    },
    errors: {
      addressNumber: { msg: "", error: false },
      addressCEP: { msg: "", error: false },
      phone: { msg: "", error: false }
    }
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  handleChangeBizType = (e, { value }) => {
    this.setState({
      company: {
        ...this.state.company,
        businessType: value
      }
    });
  };

  handlePaymentType = e => {};

  handleChange = e => {
    const _id = e.currentTarget.id;
    const _value = e.currentTarget.value;
    this.setState({
      company: {
        ...this.state.company,
        [_id]: _value
      }
    });
  };

  componentDidMount() {
    this.props.setCurrentPage({
      title: "Configurações da Empresa",
      icon: "building"
    });

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    const company = localStorage.getItem("company");
    if (company) {
      this.props.setCompany(JSON.parse(company));
    } else {
      Axios.post(config.api + "/companies", null, requestConfig)
        .then(response => {
          this.props.setCompany(response.data.company);
          localStorage.setItem(
            "company",
            JSON.stringify(response.data.company)
          );
        })
        .catch();
    }
  }

  componentDidUpdate() {
    if (this.state.company === undefined && this.props.company) {
      this.setState({ company: this.props.company });
    }
  }

  render() {
    return (
      <>
        {this.state.company !== undefined && (
          <div className="CompanyConfig">
            <div className="div company-config-menu">
              <Button.Group className="profile-menu" widths="4" basic>
                <Button
                  name="geral"
                  active={this.state.activeItem === "geral"}
                  onClick={this.handleItemClick}
                >
                  Informações da Empresa
                </Button>
                <Button
                  name="servicos"
                  active={this.state.activeItem === "servicos"}
                  onClick={this.handleItemClick}
                >
                  Serviços
                </Button>
                <Button
                  name="funcionarios"
                  active={this.state.activeItem === "funcionarios"}
                  onClick={this.handleItemClick}
                >
                  Funcionários
                </Button>
                <Button
                  name="preferencias"
                  active={this.state.activeItem === "preferencias"}
                  onClick={this.handleItemClick}
                >
                  Preferências
                </Button>
              </Button.Group>
            </div>
            <div className="company-config-body">
              {this.state.activeItem === "geral" && (
                <>
                  <div className="company-config-general">
                    <Form>
                      <div className="company-config-header">
                        Dados da Empresa
                      </div>
                      <Form.Group inline>
                        <label>Tipo de pessoa</label>
                        <Form.Radio
                          label="Física"
                          value="F"
                          checked={this.state.company.businessType === "F"}
                          onChange={this.handleChangeBizType}
                        />
                        <Form.Radio
                          label="Jurídica"
                          value="J"
                          checked={this.state.company.businessType === "J"}
                          onChange={this.handleChangeBizType}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        {this.state.company.businessType === "J" && (
                          <Form.Input
                            label="Razão social"
                            value={this.state.company.companyName}
                            onChange={this.handleChange}
                            id="companyName"
                          />
                        )}
                        <Form.Input
                          label={
                            this.state.company.businessType === "J"
                              ? "Nome fantasia"
                              : "Nome da empresa"
                          }
                          value={this.state.company.tradingName}
                          onChange={this.handleChange}
                          id="tradingName"
                        />
                        <Form.Input
                          label="Nome curto"
                          value={this.state.company.companyNickname}
                          onChange={this.handleChange}
                          id="companyNickname"
                        />
                      </Form.Group>
                      <Form.Input
                        label={
                          this.state.company.businessType === "J"
                            ? "CNPJ"
                            : "CPF"
                        }
                        value={formatCpfCnpj(this.state.company.cpfCnpj)}
                        onChange={this.handleChange}
                        id="cpfCnpj"
                        width={4}
                      />
                      <Form.Group />
                      <div className="company-config-header">Endereço</div>
                      <Form.Group widths="equal">
                        <Form.Input
                          fluid
                          label="Logradouro"
                          placeholder="Logradouro"
                          width="9"
                          onChange={this.handleAddressValue}
                          id="street"
                          value={this.state.company.address.street}
                        />
                        <Form.Input
                          fluid
                          label="Número"
                          placeholder="Número"
                          width="2"
                          onChange={this.handleAddressValue}
                          id="number"
                          value={this.state.company.address.number}
                        />
                        <Form.Input
                          fluid
                          label="CEP"
                          placeholder="CEP"
                          width="2"
                          onChange={this.handleAddressValue}
                          id="postalCode"
                          value={formatCEP(
                            this.state.company.address.postalCode
                          )}
                          error={this.state.errors.addressCEP.error}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Input
                          fluid
                          label="Bairro"
                          placeholder="Bairro"
                          width="10"
                          onChange={this.handleAddressValue}
                          id="neighborhood"
                          value={this.state.company.address.neighborhood}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Input
                          fluid
                          label="Cidade"
                          placeholder="Cidade"
                          width="6"
                          onChange={this.handleAddressValue}
                          id="city"
                          value={this.state.company.address.city}
                        />
                        <Form.Select
                          fluid
                          label="Estado"
                          options={states}
                          placeholder="Estado"
                          width="4"
                          onChange={this.handleAddressValue}
                          id="state"
                          value={this.state.company.address.state}
                        />
                      </Form.Group>
                      <div className="company-config-header">Contato</div>
                      <Form.Group>
                        <Form.Input
                          label="Email"
                          value={this.state.company.email}
                          width={8}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Input
                          label="Site"
                          value={this.state.company.website}
                          width={8}
                        />
                      </Form.Group>
                      <FormGroup widths={4}>
                        {this.state.company.phone.map(phone => (
                          <Form.Input
                            key={phone.number}
                            label={
                              phone.phoneType === "landline"
                                ? "Telefone fixo"
                                : "Telefone celular"
                            }
                            value={formatBrazilianPhoneNumber(phone.number)}
                          />
                        ))}
                      </FormGroup>
                      <div className="company-config-header">
                        Formas de Pagamento
                      </div>
                      <div className="company-config-subheader">
                        Cartões de Crédito
                      </div>
                      <div className="company-payment-types">
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.amex.icon}
                            alt={this.state.paymentTypes.cc.amex.name}
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.amex.name}
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.cc.amex.enabled}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.dinersClub.icon}
                            alt={this.state.paymentTypes.cc.dinersClub.name}
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.dinersClub.name}
                            className="company-payment-type-chkbox"
                            checked={
                              this.state.paymentTypes.cc.dinersClub.enabled
                            }
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.discover.icon}
                            alt={this.state.paymentTypes.cc.discover.name}
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.discover.name}
                            className="company-payment-type-chkbox"
                            checked={
                              this.state.paymentTypes.cc.discover.enabled
                            }
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.elo.icon}
                            alt={this.state.paymentTypes.cc.elo.name}
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.elo.name}
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.cc.elo.enabled}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.hipercard.icon}
                            alt={this.state.paymentTypes.cc.hipercard.name}
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.hipercard.name}
                            className="company-payment-type-chkbox"
                            checked={
                              this.state.paymentTypes.cc.hipercard.enabled
                            }
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.masterCard.icon}
                            alt={this.state.paymentTypes.cc.masterCard.name}
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.masterCard.name}
                            className="company-payment-type-chkbox"
                            checked={
                              this.state.paymentTypes.cc.masterCard.enabled
                            }
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.visa.icon}
                            alt={this.state.paymentTypes.cc.visa.name}
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.visa.name}
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.cc.visa.enabled}
                          />
                        </div>
                      </div>
                      <div className="company-config-subheader">
                        Outras modalidades
                      </div>
                      <div className="company-payment-types">
                        <div className="company-payment-type">
                          <img
                            src="https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/boleto.png"
                            alt="Boleto"
                          />
                          <Checkbox
                            label="Boleto"
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.other.boleto}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src="https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/debitcard.png"
                            alt="Cartão de Débito"
                          />
                          <Checkbox
                            label="Cartão de Débito"
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.other.debitCard}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src="https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/crypto.png"
                            alt="Cryptomoeda"
                          />
                          <Checkbox
                            label="Cryptomoeda"
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.other.crypto}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src="https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/cash.png"
                            alt="Dinheiro"
                          />
                          <Checkbox
                            label="Dinheiro"
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.other.cash}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src="https://res.cloudinary.com/bukkapp/image/upload/v1547692316/Bukk/Assets/Payment%20Icons/transfer.png"
                            alt="Transferência"
                          />
                          <Checkbox
                            label="Transferência"
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.other.wireTransfer}
                          />
                        </div>
                      </div>
                    </Form>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </>
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
)(CompanyConfig);
