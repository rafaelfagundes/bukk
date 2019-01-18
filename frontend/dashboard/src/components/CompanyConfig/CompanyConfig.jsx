import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentPage, setCompany } from "../dashboardActions";
import { Button, Form, FormGroup, Checkbox, Icon } from "semantic-ui-react";
import Axios from "axios";
import config from "../../config";
import "./CompanyConfig.css";
import { states } from "../../config/BrasilAddress";
import { formatCEP, formatBrazilianPhoneNumber, formatCpfCnpj } from "../utils";
import FormTitle from "../Common/FormTitle";
import FormSubTitle from "../Common/FormSubTitle";

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
        dinersclub: {
          enabled: false,
          name: "Diners Club",
          id: "dinersclub",
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
        mastercard: {
          enabled: false,
          name: "MasterCard",
          id: "mastercard",
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

  handlePaymentTypeCc = e => {
    let _checked = undefined;
    let _id = undefined;

    if (e.currentTarget.id.indexOf("-img") >= 0) {
      _checked = !e.currentTarget.checked;
      _id = e.currentTarget.id.replace("-img", "");
    } else {
      _checked = e.currentTarget.checked;
      _id = e.currentTarget.id;
    }

    this.setState({
      paymentTypes: {
        ...this.state.paymentTypes,
        cc: {
          ...this.state.paymentTypes.cc,
          [_id]: {
            ...this.state.paymentTypes.cc[_id],
            enabled: _checked
          }
        }
      }
    });
  };

  handlePaymentTypeOther = e => {
    let _checked = undefined;
    let _id = undefined;

    if (e.currentTarget.id.indexOf("-img") >= 0) {
      _checked = !e.currentTarget.checked;
      _id = e.currentTarget.id.replace("-img", "");
    } else {
      _checked = e.currentTarget.checked;
      _id = e.currentTarget.id;
    }

    this.setState({
      paymentTypes: {
        ...this.state.paymentTypes,
        other: {
          ...this.state.paymentTypes.other,
          [_id]: _checked
        }
      }
    });
  };

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

  handleLogo = e => {
    var input, file, fr, img, canvasLogo;

    canvasLogo = this.canvasLogo;

    if (typeof window.FileReader !== "function") {
      alert("Impossivel enviar imagem. Navegador não suportado.");
      return;
    }

    input = e.currentTarget;
    file = input.files[0];
    fr = new FileReader();
    fr.onload = createImage;
    fr.readAsDataURL(file);

    function createImage() {
      img = new Image();
      img.onload = imageLoaded;
      img.src = fr.result;
    }

    function imageLoaded() {
      canvasLogo.width = img.width;
      canvasLogo.height = img.height;
      var ctx = canvasLogo.getContext("2d");
      ctx.drawImage(img, 0, 0);
    }
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
      this.setState({ company: this.props.company }, () => {
        let _state = { paymentTypes: this.state.paymentTypes };

        this.state.company.paymentOptions.forEach(pt => {
          if (pt.paymentType === "cc") {
            _state = {
              paymentTypes: {
                ..._state.paymentTypes,
                cc: {
                  ..._state.paymentTypes.cc,
                  [pt.paymentId]: {
                    ..._state.paymentTypes.cc[pt.paymentId],
                    enabled: true
                  }
                }
              }
            };
          } else {
            _state = {
              paymentTypes: {
                ..._state.paymentTypes,
                other: {
                  ..._state.paymentTypes.other,
                  [pt.paymentId]: true
                }
              }
            };
          }
        });
        this.setState(_state);
      });
    }

    // Load logo on Canvas
    if (this.state.company !== undefined && this.canvasLogo) {
      this.canvasLogo.style.backgroundColor = this.state.company.settings.colors.primary;

      const context = this.canvasLogo.getContext("2d");
      const image = new Image();
      image.src = this.state.company.logo;

      image.onload = () => {
        this.canvasLogo.width = image.width;
        this.canvasLogo.height = image.height;
        context.drawImage(
          image,
          this.canvasLogo.width / 2 - image.width / 2,
          this.canvasLogo.height / 2 - image.height / 2
        );
      };
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
                      <FormTitle text="Logotipo" first />
                      <div className="company-config-logo">
                        <canvas
                          id="company-config-logo-canvas"
                          ref={canvasLogo => (this.canvasLogo = canvasLogo)}
                          height="10"
                          width="10"
                        />
                        <span className="company-config-logo-info">
                          <strong>Dica:</strong> A cor de fundo acima é a mesma
                          de onde seu logotipo será exibido, portanto tente
                          deixar seu logo bem visível.
                        </span>
                        <label
                          className="ui icon left labeled button"
                          htmlFor="logoUpload"
                        >
                          <Icon name="pencil" />
                          Alterar logotipo
                        </label>
                        <input
                          type="file"
                          name="logoUpload"
                          id="logoUpload"
                          onChange={this.handleLogo}
                          style={{ display: "none" }}
                        />
                      </div>
                      <FormTitle text="Dados da Empresa" />
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
                      <FormTitle text="Endereço" />
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
                      <FormTitle text="Contato" />
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
                      <FormTitle text="Formas de Pagamento" />
                      <FormSubTitle text="Cartões de Crédito" />
                      <div className="company-payment-types">
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.amex.icon}
                            alt={this.state.paymentTypes.cc.amex.name}
                            onClick={this.handlePaymentTypeCc}
                            id={this.state.paymentTypes.cc.amex.id + "-img"}
                            checked={this.state.paymentTypes.cc.amex.enabled}
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.amex.name}
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.cc.amex.enabled}
                            id={this.state.paymentTypes.cc.amex.id}
                            onChange={this.handlePaymentTypeCc}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.dinersclub.icon}
                            alt={this.state.paymentTypes.cc.dinersclub.name}
                            onClick={this.handlePaymentTypeCc}
                            id={
                              this.state.paymentTypes.cc.dinersclub.id + "-img"
                            }
                            checked={
                              this.state.paymentTypes.cc.dinersclub.enabled
                            }
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.dinersclub.name}
                            className="company-payment-type-chkbox"
                            checked={
                              this.state.paymentTypes.cc.dinersclub.enabled
                            }
                            id={this.state.paymentTypes.cc.dinersclub.id}
                            onChange={this.handlePaymentTypeCc}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.discover.icon}
                            alt={this.state.paymentTypes.cc.discover.name}
                            onClick={this.handlePaymentTypeCc}
                            id={this.state.paymentTypes.cc.discover.id + "-img"}
                            checked={
                              this.state.paymentTypes.cc.discover.enabled
                            }
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.discover.name}
                            className="company-payment-type-chkbox"
                            checked={
                              this.state.paymentTypes.cc.discover.enabled
                            }
                            id={this.state.paymentTypes.cc.discover.id}
                            onChange={this.handlePaymentTypeCc}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.elo.icon}
                            alt={this.state.paymentTypes.cc.elo.name}
                            onClick={this.handlePaymentTypeCc}
                            id={this.state.paymentTypes.cc.elo.id + "-img"}
                            checked={this.state.paymentTypes.cc.elo.enabled}
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.elo.name}
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.cc.elo.enabled}
                            id={this.state.paymentTypes.cc.elo.id}
                            onChange={this.handlePaymentTypeCc}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.hipercard.icon}
                            alt={this.state.paymentTypes.cc.hipercard.name}
                            onClick={this.handlePaymentTypeCc}
                            id={
                              this.state.paymentTypes.cc.hipercard.id + "-img"
                            }
                            checked={
                              this.state.paymentTypes.cc.hipercard.enabled
                            }
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.hipercard.name}
                            className="company-payment-type-chkbox"
                            checked={
                              this.state.paymentTypes.cc.hipercard.enabled
                            }
                            id={this.state.paymentTypes.cc.hipercard.id}
                            onChange={this.handlePaymentTypeCc}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.mastercard.icon}
                            alt={this.state.paymentTypes.cc.mastercard.name}
                            onClick={this.handlePaymentTypeCc}
                            id={
                              this.state.paymentTypes.cc.mastercard.id + "-img"
                            }
                            checked={
                              this.state.paymentTypes.cc.mastercard.enabled
                            }
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.mastercard.name}
                            className="company-payment-type-chkbox"
                            checked={
                              this.state.paymentTypes.cc.mastercard.enabled
                            }
                            id={this.state.paymentTypes.cc.mastercard.id}
                            onChange={this.handlePaymentTypeCc}
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src={this.state.paymentTypes.cc.visa.icon}
                            alt={this.state.paymentTypes.cc.visa.name}
                            onClick={this.handlePaymentTypeCc}
                            id={this.state.paymentTypes.cc.visa.id + "-img"}
                            checked={this.state.paymentTypes.cc.visa.enabled}
                          />
                          <Checkbox
                            label={this.state.paymentTypes.cc.visa.name}
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.cc.visa.enabled}
                            id={this.state.paymentTypes.cc.visa.id}
                            onChange={this.handlePaymentTypeCc}
                          />
                        </div>
                      </div>
                      <FormSubTitle text="Outras modalidades" />
                      <div className="company-payment-types">
                        <div className="company-payment-type">
                          <img
                            src="https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/boleto.png"
                            alt="Boleto"
                            onClick={this.handlePaymentTypeOther}
                            id="boleto-img"
                            checked={this.state.paymentTypes.other.boleto}
                          />
                          <Checkbox
                            label="Boleto"
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.other.boleto}
                            onChange={this.handlePaymentTypeOther}
                            id="boleto"
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src="https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/debitcard.png"
                            alt="Cartão de Débito"
                            onClick={this.handlePaymentTypeOther}
                            id="debitCard-img"
                            checked={this.state.paymentTypes.other.debitCard}
                          />
                          <Checkbox
                            label="Cartão de Débito"
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.other.debitCard}
                            onChange={this.handlePaymentTypeOther}
                            id="debitCard"
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src="https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/crypto.png"
                            alt="Cryptomoeda"
                            onClick={this.handlePaymentTypeOther}
                            id="crypto-img"
                            checked={this.state.paymentTypes.other.crypto}
                          />
                          <Checkbox
                            label="Cryptomoeda"
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.other.crypto}
                            onChange={this.handlePaymentTypeOther}
                            id="crypto"
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src="https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/cash.png"
                            alt="Dinheiro"
                            onClick={this.handlePaymentTypeOther}
                            id="cash-img"
                            checked={this.state.paymentTypes.other.cash}
                          />
                          <Checkbox
                            label="Dinheiro"
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.other.cash}
                            onChange={this.handlePaymentTypeOther}
                            id="cash"
                          />
                        </div>
                        <div className="company-payment-type">
                          <img
                            src="https://res.cloudinary.com/bukkapp/image/upload/v1547692316/Bukk/Assets/Payment%20Icons/transfer.png"
                            alt="Transferência"
                            onClick={this.handlePaymentTypeOther}
                            id="wireTransfer-img"
                            checked={this.state.paymentTypes.other.wireTransfer}
                          />
                          <Checkbox
                            label="Transferência"
                            className="company-payment-type-chkbox"
                            checked={this.state.paymentTypes.other.wireTransfer}
                            onChange={this.handlePaymentTypeOther}
                            id="wireTransfer"
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
