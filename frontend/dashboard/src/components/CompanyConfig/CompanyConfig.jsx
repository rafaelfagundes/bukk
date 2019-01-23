/* eslint no-loop-func: 0 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Axios from "axios";
import {
  Button,
  Form,
  FormGroup,
  Checkbox,
  Icon,
  Divider,
  Table,
  Input
} from "semantic-ui-react";
import {
  setCurrentPage,
  setCompany,
  setCompanyLogo
} from "../dashboardActions";
import "./CompanyConfig.css";
import { states } from "../../config/BrasilAddress";
import {
  formatCEP,
  formatBrazilianPhoneNumber,
  formatCpf,
  formatCnpj,
  formatHour
} from "../utils";
import FormTitle from "../Common/FormTitle";
import FormSubTitle from "../Common/FormSubTitle";
import Notification from "../Notification/Notification";
import config from "../../config";
import ValidationError from "../Common/ValidationError";
import validator from "validator";
import {
  isCNPJ,
  isCPF,
  isPostalCode,
  isMobilePhoneWithDDD,
  isPhoneWithDDD
} from "../validation";

const errorList = {
  companyName: { msg: "", error: false },
  tradingName: { msg: "", error: false },
  companyNickname: { msg: "", error: false },
  cpfCnpj: { msg: "", error: false },
  addressStreet: { msg: "", error: false },
  addressNumber: { msg: "", error: false },
  addressCEP: { msg: "", error: false },
  addressNeighborhood: { msg: "", error: false },
  addressCity: { msg: "", error: false },
  addressState: { msg: "", error: false },
  email: { msg: "", error: false },
  website: { msg: "", error: false },
  phone: { msg: "", error: false },
  cellphone: { msg: "", error: false },
  paymentTypes: { msg: "", error: false },
  workingDays: []
};

/*
const errorList = {
  general:[],
  address: [],
  contact: [],
  paymentTypes: { msg: "", error: false },
  workingDays: []
};
TODO: usar essa estrutura para os erros */

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
    workingDays: {
      sunday: {
        checked: false,
        workingHours: []
      },
      monday: {
        checked: false,
        workingHours: []
      },
      tuesday: {
        checked: false,
        workingHours: []
      },
      wednesday: {
        checked: false,
        workingHours: []
      },
      thursday: {
        checked: false,
        workingHours: []
      },
      friday: {
        checked: false,
        workingHours: []
      },
      saturday: {
        checked: false,
        workingHours: []
      }
    },
    errors: JSON.parse(JSON.stringify(errorList))
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleWorkDay = e => {
    let _id = e.currentTarget.id;
    let _checked = e.currentTarget.checked;

    this.setState({
      workingDays: {
        ...this.state.workingDays,
        [_id]: {
          ...this.state.workingDays[_id],
          checked: _checked
        }
      }
    });
  };

  handleWorkTime = e => {
    e.preventDefault();
    let _day = e.currentTarget.id.split("-")[0];
    let _index = e.currentTarget.id.split("-")[1];
    let _startEnd = e.currentTarget.id.split("-")[2];
    let _value = e.currentTarget.value;

    let _item = {};
    if (_startEnd === "start") {
      _item = {
        _id: this.state.workingDays[_day].workingHours[_index]._id,
        start: formatHour(_value),
        end: this.state.workingDays[_day].workingHours[_index].end
      };
    } else {
      _item = {
        _id: this.state.workingDays[_day].workingHours[_index]._id,
        start: this.state.workingDays[_day].workingHours[_index].start,
        end: formatHour(_value)
      };
    }

    let _workingHours = this.state.workingDays[_day].workingHours;
    _workingHours[_index] = _item;

    this.setState({
      workingDays: {
        ...this.state.workingDays,
        [_day]: {
          ...this.state.workingDays[_day],
          workingHours: _workingHours
        }
      }
    });
  };

  addWorkTime = e => {
    e.preventDefault();
    let _day = e.currentTarget.dataset.day;
    this.setState({
      workingDays: {
        ...this.state.workingDays,
        [_day]: {
          ...this.state.workingDays[_day],
          workingHours: [
            ...this.state.workingDays[_day].workingHours,
            { start: "", end: "" }
          ]
        }
      }
    });
  };

  removeWorkTime = e => {
    e.preventDefault();
    let _day = e.currentTarget.dataset.day;
    let _index = e.currentTarget.dataset.index;

    let _workingDays = JSON.parse(JSON.stringify(this.state.workingDays));
    _workingDays[_day].workingHours.splice([_index], 1);

    this.setState({
      workingDays: _workingDays
    });
  };

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

  handleAddressValue = (e, { id, value }) => {
    let _id = e.currentTarget.id;
    let _value = e.currentTarget.value;

    if (!_id || _value) {
      _id = id;
      _value = value;
    }

    if (_value === undefined) _value = "";

    this.setState({
      company: {
        ...this.state.company,
        address: {
          ...this.state.company.address,
          [_id]: _value
        }
      }
    });
  };

  handlePhone = e => {
    let _id = e.currentTarget.id;
    let _value = e.currentTarget.value;

    let _phones = JSON.parse(JSON.stringify(this.state.company.phone));

    _phones.forEach(phone => {
      if (phone.phoneType === _id) {
        phone.number = _value;
      }
    });
    this.setState({
      company: {
        ...this.state.company,
        phone: _phones
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

  validateCompany = () => {
    let _errors = JSON.parse(JSON.stringify(errorList));

    let _errorsCount = 0;

    /* ====================================================
     Dados da empresa
    ==================================================== */
    if (validator.isEmpty(this.state.company.tradingName)) {
      _errorsCount++;
      _errors.tradingName.msg = "Por favor, preencha o Nome Fantasia";
      _errors.tradingName.error = true;
    }
    if (validator.isEmpty(this.state.company.companyNickname)) {
      _errorsCount++;
      _errors.companyNickname.msg = "Por favor, preencha o Nome Curto";
      _errors.companyNickname.error = true;
    }
    if (validator.isEmpty(this.state.company.cpfCnpj)) {
      _errorsCount++;
      _errors.cpfCnpj.msg =
        this.state.company.businessType === "J"
          ? "Por favor, preencha o CNPJ"
          : "Por favor, preencha o CPF";
      _errors.cpfCnpj.error = true;
    }
    if (this.state.company.businessType === "J") {
      if (!isCNPJ(this.state.company.cpfCnpj)) {
        _errorsCount++;
        _errors.cpfCnpj.msg = "CNPJ inválido";
        _errors.cpfCnpj.error = true;
      }
      if (validator.isEmpty(this.state.company.companyName)) {
        _errorsCount++;
        _errors.companyName.msg = "Por favor, preencha a Razão Social";
        _errors.companyName.error = true;
      }
    } else {
      if (!isCPF(this.state.company.cpfCnpj)) {
        _errorsCount++;
        _errors.cpfCnpj.msg = "CPF inválido";
        _errors.cpfCnpj.error = true;
      }
    }

    /* ====================================================
     Endereço
    ==================================================== */
    if (validator.isEmpty(this.state.company.address.street)) {
      _errorsCount++;
      _errors.addressStreet.msg = "Por favor, preencha o Logradouro";
      _errors.addressStreet.error = true;
    }
    if (validator.isEmpty(this.state.company.address.number)) {
      _errorsCount++;
      _errors.addressNumber.msg =
        "Por favor, preencha o Número do endereço da empresa";
      _errors.addressNumber.error = true;
    }
    if (validator.isEmpty(this.state.company.address.neighborhood)) {
      _errorsCount++;
      _errors.addressNeighborhood.msg = "Por favor, preencha o Bairro";
      _errors.addressNeighborhood.error = true;
    }
    if (validator.isEmpty(this.state.company.address.city)) {
      _errorsCount++;
      _errors.addressCity.msg = "Por favor, preencha a Cidade";
      _errors.addressCity.error = true;
    }
    if (validator.isEmpty(this.state.company.address.postalCode)) {
      _errorsCount++;
      _errors.addressCEP.msg = "Por favor, preencha a Cidade";
      _errors.addressCEP.error = true;
    }
    if (!isPostalCode(this.state.company.address.postalCode)) {
      _errorsCount++;
      _errors.addressCEP.msg = "CEP inválido";
      _errors.addressCEP.error = true;
    }
    if (this.state.company.address.state === "") {
      _errorsCount++;
      _errors.addressState.msg = "Por favor, selecione o Estado";
      _errors.addressState.error = true;
    }

    /* ====================================================
     Contato
    ==================================================== */
    if (
      !validator.isEmpty(this.state.company.website) &&
      !validator.isURL(this.state.company.website)
    ) {
      _errorsCount++;
      _errors.website.msg = "O endereço do site é inválido";
      _errors.website.error = true;
    }
    if (
      !validator.isEmpty(this.state.company.email) &&
      !validator.isEmail(this.state.company.email)
    ) {
      _errorsCount++;
      _errors.email.msg = "O email é inválido";
      _errors.email.error = true;
    }

    this.state.company.phone.forEach(phone => {
      if (phone.phoneType === "cellphone") {
        if (!isMobilePhoneWithDDD(phone.number)) {
          _errorsCount++;
          _errors.cellphone.msg = "O telefone celular é inválido";
          _errors.cellphone.error = true;
        }
      } else {
        if (!isPhoneWithDDD(phone.number)) {
          _errorsCount++;
          _errors.phone.msg = "O telefone fixo é inválido";
          _errors.phone.error = true;
        }
      }
    });

    /* ====================================================
     Formas de pagamento
    ==================================================== */
    let countEnabled = 0;
    for (let key in this.state.paymentTypes) {
      if (key === "cc") {
        for (let type in this.state.paymentTypes[key]) {
          if (this.state.paymentTypes[key][type].enabled) {
            countEnabled++;
          }
        }
      } else {
        for (let type in this.state.paymentTypes[key]) {
          if (this.state.paymentTypes[key][type]) {
            countEnabled++;
          }
        }
      }
    }
    if (countEnabled === 0) {
      _errorsCount++;
      _errors.paymentTypes.msg =
        "Selecione ao menos 1 (uma) forma de pagamento";
      _errors.paymentTypes.error = true;
    }

    /* ====================================================
     Horário de funcionamento
    ==================================================== */

    const mapWeekDays = {
      sunday: "domingo",
      monday: "segunda-feira",
      tuesday: "terça-feira",
      wednesday: "quarta-feira",
      thursday: "quinta-feira",
      friday: "sexta",
      saturday: "sábado"
    };

    countEnabled = 0;
    for (let key in this.state.workingDays) {
      if (this.state.workingDays[key].checked) {
        countEnabled++;
        this.state.workingDays[key].workingHours.forEach(wh => {
          let _startHour = Number(wh.start.split(":")[0]);
          let _startMinute = Number(wh.start.split(":")[1]);

          let _endHour = Number(wh.end.split(":")[0]);
          let _endMinute = Number(wh.end.split(":")[1]);

          if (
            _startHour < 0 ||
            _startHour > 23 ||
            _startMinute < 0 ||
            _startMinute > 59
          ) {
            _errors.workingDays.push({
              error: true,
              msg: `Horário inicial de ${mapWeekDays[key]} é inválido. [${
                wh.start
              }]`
            });
            _errorsCount++;
          }

          if (
            _endHour < 0 ||
            _endHour > 23 ||
            _endMinute < 0 ||
            _endMinute > 59
          ) {
            _errors.workingDays.push({
              error: true,
              msg: `Horário final de ${mapWeekDays[key]} é inválido. [${
                wh.end
              }]`
            });
            _errorsCount++;
          }
        });
      }
    }
    if (countEnabled === 0) {
      _errors.workingDays.push({
        error: true,
        msg: "Por favor, configure ao menos 1 (um) dia de expediente"
      });
    }

    /* Finally */
    this.setState({ errors: _errors });
    if (_errorsCount > 0) {
      return false;
    } else {
      return true;
    }
  };

  saveCompanyInfo = e => {
    if (!this.validateCompany()) {
      return false;
    }

    const _company = JSON.parse(JSON.stringify(this.state.company));

    delete _company["settings"];
    delete _company["social"]; // TODO: analisar se vale a pena colocar as redes sociais aqui ou não

    if (this.imageInput.value) {
      toast(
        <Notification
          type="notification"
          title="Enviando imagem"
          text="Estamos salvando o seu novo logo"
        />
      );
      const data = new FormData(e.currentTarget);

      const token = localStorage.getItem("token");
      let requestConfig = {
        headers: {
          Authorization: token
        }
      };
      Axios.post(config.api + "/images/logo", data, requestConfig)
        .then(response => {
          toast(
            <Notification
              type="success"
              title="Imagem enviada com sucesso"
              text="O seu novo logo está armazenado"
            />
          );
          this.props.setCompanyLogo(response.data.logoUrl);
          this.setState({ company: this.props.company });
          localStorage.setItem("company", JSON.stringify(this.props.company));
        })
        .catch(err => {
          toast(
            <Notification
              type="erro"
              title="Erro ao atualizar imagem"
              text={err.response.data.msg}
            />
          );
        });
      e.currentTarget.reset();
    }
  };

  componentDidUpdate() {
    if (this.props.company && !this.props.currentPage) {
      this.props.setCurrentPage({
        title: "Configurações de " + this.props.company.companyNickname,
        icon: "building"
      });
    }

    if (this.state.company === undefined && this.props.company) {
      this.setState({ company: this.props.company }, () => {
        let _state = {
          paymentTypes: this.state.paymentTypes,
          workingDays: this.state.workingDays
        };

        this.state.company.paymentOptions.forEach(pt => {
          if (pt.paymentType === "cc") {
            _state = {
              ..._state,
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
              ..._state,
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

        this.state.company.workingDays.forEach(wd => {
          switch (wd.weekDay) {
            case "sun":
              _state = {
                ..._state,
                workingDays: {
                  ..._state.workingDays,
                  sunday: {
                    checked: wd.workingHours.length > 0 ? true : false,
                    workingHours: wd.workingHours
                  }
                }
              };
              break;
            case "mon":
              _state = {
                ..._state,
                workingDays: {
                  ..._state.workingDays,
                  monday: {
                    checked: wd.workingHours.length > 0 ? true : false,
                    workingHours: wd.workingHours
                  }
                }
              };
              break;
            case "tue":
              _state = {
                ..._state,
                workingDays: {
                  ..._state.workingDays,
                  tuesday: {
                    checked: wd.workingHours.length > 0 ? true : false,
                    workingHours: wd.workingHours
                  }
                }
              };
              break;
            case "wed":
              _state = {
                ..._state,
                workingDays: {
                  ..._state.workingDays,
                  wednesday: {
                    checked: wd.workingHours.length > 0 ? true : false,
                    workingHours: wd.workingHours
                  }
                }
              };
              break;
            case "thu":
              _state = {
                ..._state,
                workingDays: {
                  ..._state.workingDays,
                  thursday: {
                    checked: wd.workingHours.length > 0 ? true : false,
                    workingHours: wd.workingHours
                  }
                }
              };
              break;
            case "fri":
              _state = {
                ..._state,
                workingDays: {
                  ..._state.workingDays,
                  friday: {
                    checked: wd.workingHours.length > 0 ? true : false,
                    workingHours: wd.workingHours
                  }
                }
              };
              break;
            case "sat":
              _state = {
                ..._state,
                workingDays: {
                  ..._state.workingDays,
                  saturday: {
                    checked: wd.workingDays.length > 0 ? true : false,
                    workingHours: wd.workingHours
                  }
                }
              };
              break;

            default:
              break;
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
              {this.state.activeItem === "geral" &&
                this.state.company !== undefined && (
                  <>
                    <div className="company-config-general">
                      <Form
                        ref={formCompany => (this.formCompany = formCompany)}
                        onSubmit={this.saveCompanyInfo}
                      >
                        <FormTitle text="Logotipo" first />
                        <div className="company-config-logo">
                          <canvas
                            id="company-config-logo-canvas"
                            ref={canvasLogo => (this.canvasLogo = canvasLogo)}
                            height="10"
                            width="10"
                          />
                          <span className="company-config-logo-info">
                            <strong>Dica:</strong> A cor de fundo acima é a
                            mesma de onde seu logotipo será exibido, portanto
                            tente deixar seu logo bem visível.
                          </span>
                          <label
                            className="ui icon left labeled button"
                            htmlFor="logo-image"
                          >
                            <Icon name="pencil" />
                            Alterar logotipo
                          </label>
                          <input
                            type="file"
                            name="logo-image"
                            id="logo-image"
                            onChange={this.handleLogo}
                            ref={imageInput => (this.imageInput = imageInput)}
                            hidden
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
                              error={this.state.errors.companyName.error}
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
                            error={this.state.errors.companyName.error}
                          />
                          <Form.Input
                            label="Nome curto"
                            value={this.state.company.companyNickname}
                            onChange={this.handleChange}
                            id="companyNickname"
                            error={this.state.errors.companyNickname.error}
                          />
                        </Form.Group>
                        <Form.Input
                          label={
                            this.state.company.businessType === "J"
                              ? "CNPJ"
                              : "CPF"
                          }
                          value={
                            this.state.company.businessType === "J"
                              ? formatCnpj(this.state.company.cpfCnpj)
                              : formatCpf(this.state.company.cpfCnpj)
                          }
                          onChange={this.handleChange}
                          id="cpfCnpj"
                          width={4}
                          error={this.state.errors.cpfCnpj.error}
                        />

                        <ValidationError
                          show={this.state.errors.companyName.error}
                          error={this.state.errors.companyName.msg}
                        />
                        <ValidationError
                          show={this.state.errors.tradingName.error}
                          error={this.state.errors.tradingName.msg}
                        />
                        <ValidationError
                          show={this.state.errors.companyNickname.error}
                          error={this.state.errors.companyNickname.msg}
                        />
                        <ValidationError
                          show={this.state.errors.cpfCnpj.error}
                          error={this.state.errors.cpfCnpj.msg}
                        />

                        <FormTitle text="Endereço" />
                        <Form.Group widths="equal">
                          <Form.Input
                            fluid
                            label="Logradouro"
                            placeholder="Logradouro"
                            width="9"
                            value={this.state.company.address.street || ""}
                            onChange={this.handleAddressValue}
                            id="street"
                            error={this.state.errors.addressStreet.error}
                          />
                          <Form.Input
                            fluid
                            label="Número"
                            placeholder="Número"
                            width="2"
                            onChange={this.handleAddressValue}
                            id="number"
                            value={this.state.company.address.number}
                            error={this.state.errors.addressNumber.error}
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
                            error={this.state.errors.addressNeighborhood.error}
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
                            error={this.state.errors.addressCity.error}
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

                        <ValidationError
                          show={this.state.errors.addressStreet.error}
                          error={this.state.errors.addressStreet.msg}
                        />
                        <ValidationError
                          show={this.state.errors.addressNumber.error}
                          error={this.state.errors.addressNumber.msg}
                        />
                        <ValidationError
                          show={this.state.errors.addressCEP.error}
                          error={this.state.errors.addressCEP.msg}
                        />
                        <ValidationError
                          show={this.state.errors.addressNeighborhood.error}
                          error={this.state.errors.addressNeighborhood.msg}
                        />
                        <ValidationError
                          show={this.state.errors.addressCity.error}
                          error={this.state.errors.addressCity.msg}
                        />
                        <ValidationError
                          show={this.state.errors.addressState.error}
                          error={this.state.errors.addressState.msg}
                        />

                        <FormTitle text="Contato" />
                        <Form.Group>
                          <Form.Input
                            label="Email"
                            value={this.state.company.email}
                            width={8}
                            error={this.state.errors.email.error}
                            onChange={this.handleChange}
                            id="email"
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Input
                            label="Site"
                            value={this.state.company.website}
                            width={8}
                            error={this.state.errors.website.error}
                            onChange={this.handleChange}
                            id="website"
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
                              error={this.state.errors.phone.error}
                              onChange={this.handlePhone}
                              id={phone.phoneType}
                            />
                          ))}
                        </FormGroup>

                        <ValidationError
                          show={this.state.errors.email.error}
                          error={this.state.errors.email.msg}
                        />
                        <ValidationError
                          show={this.state.errors.website.error}
                          error={this.state.errors.website.msg}
                        />
                        <ValidationError
                          show={this.state.errors.phone.error}
                          error={this.state.errors.phone.msg}
                        />
                        <ValidationError
                          show={this.state.errors.cellphone.error}
                          error={this.state.errors.cellphone.msg}
                        />

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
                                this.state.paymentTypes.cc.dinersclub.id +
                                "-img"
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
                              id={
                                this.state.paymentTypes.cc.discover.id + "-img"
                              }
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
                                this.state.paymentTypes.cc.mastercard.id +
                                "-img"
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
                              checked={
                                this.state.paymentTypes.other.wireTransfer
                              }
                            />
                            <Checkbox
                              label="Transferência"
                              className="company-payment-type-chkbox"
                              checked={
                                this.state.paymentTypes.other.wireTransfer
                              }
                              onChange={this.handlePaymentTypeOther}
                              id="wireTransfer"
                            />
                          </div>
                        </div>
                        <br />
                        <ValidationError
                          show={this.state.errors.paymentTypes.error}
                          error={this.state.errors.paymentTypes.msg}
                        />
                        <FormTitle text="Horário de Funcionamento" />
                        <Table celled className="company-timetable">
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell>
                                <Checkbox
                                  label="Domingo"
                                  checked={
                                    this.state.workingDays.sunday.checked
                                  }
                                  onChange={this.handleWorkDay}
                                  id="sunday"
                                />
                              </Table.HeaderCell>
                              <Table.HeaderCell>
                                <Checkbox
                                  label="Segunda"
                                  checked={
                                    this.state.workingDays.monday.checked
                                  }
                                  onChange={this.handleWorkDay}
                                  id="monday"
                                />
                              </Table.HeaderCell>
                              <Table.HeaderCell>
                                <Checkbox
                                  label="Terça"
                                  checked={
                                    this.state.workingDays.tuesday.checked
                                  }
                                  onChange={this.handleWorkDay}
                                  id="tuesday"
                                />
                              </Table.HeaderCell>
                              <Table.HeaderCell>
                                <Checkbox
                                  label="Quarta"
                                  checked={
                                    this.state.workingDays.wednesday.checked
                                  }
                                  onChange={this.handleWorkDay}
                                  id="wednesday"
                                />
                              </Table.HeaderCell>
                              <Table.HeaderCell>
                                <Checkbox
                                  label="Quinta"
                                  checked={
                                    this.state.workingDays.thursday.checked
                                  }
                                  onChange={this.handleWorkDay}
                                  id="thursday"
                                />
                              </Table.HeaderCell>
                              <Table.HeaderCell>
                                <Checkbox
                                  label="Sexta"
                                  checked={
                                    this.state.workingDays.friday.checked
                                  }
                                  onChange={this.handleWorkDay}
                                  id="friday"
                                />
                              </Table.HeaderCell>
                              <Table.HeaderCell>
                                <Checkbox
                                  label="Sábado"
                                  checked={
                                    this.state.workingDays.saturday.checked
                                  }
                                  onChange={this.handleWorkDay}
                                  id="saturday"
                                />
                              </Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            <Table.Row>
                              {/* Sunday */}
                              <Table.Cell>
                                {this.state.workingDays.sunday.checked &&
                                  this.state.workingDays.sunday.workingHours.map(
                                    (h, index) => (
                                      <span
                                        className="company-config-time"
                                        key={index}
                                      >
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.start)}
                                          size="small"
                                          className="company-config-time-start"
                                          id={"sunday-" + index + "-start"}
                                        />{" "}
                                        às{" "}
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.end)}
                                          size="small"
                                          className="company-config-time-end"
                                          id={"sunday-" + index + "-end"}
                                        />
                                        <Button
                                          size="mini"
                                          compact
                                          icon
                                          labelPosition="left"
                                          onClick={this.removeWorkTime}
                                          data-day="sunday"
                                          data-index={index}
                                        >
                                          <Icon name="delete" />
                                          Remover
                                        </Button>
                                      </span>
                                    )
                                  )}
                                {!this.state.workingDays.sunday.checked && (
                                  <span>Não há expediente</span>
                                )}
                                {this.state.workingDays.sunday.checked && (
                                  <Button
                                    onClick={this.addWorkTime}
                                    data-day="sunday"
                                    size="mini"
                                    compact
                                    color="blue"
                                    icon
                                    labelPosition="left"
                                  >
                                    <Icon name="plus" />
                                    Adicionar
                                  </Button>
                                )}
                              </Table.Cell>
                              {/* Monday */}
                              <Table.Cell>
                                {this.state.workingDays.monday.checked &&
                                  this.state.workingDays.monday.workingHours.map(
                                    (h, index) => (
                                      <span
                                        className="company-config-time"
                                        key={index}
                                      >
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.start)}
                                          size="small"
                                          className="company-config-time-start"
                                          id={"monday-" + index + "-start"}
                                        />{" "}
                                        às{" "}
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.end)}
                                          size="small"
                                          className="company-config-time-end"
                                          id={"monday-" + index + "-end"}
                                        />
                                        <Button
                                          size="mini"
                                          compact
                                          icon
                                          labelPosition="left"
                                          onClick={this.removeWorkTime}
                                          data-day="monday"
                                          data-index={index}
                                        >
                                          <Icon name="delete" />
                                          Remover
                                        </Button>
                                      </span>
                                    )
                                  )}
                                {!this.state.workingDays.monday.checked && (
                                  <span>Não há expediente</span>
                                )}
                                {this.state.workingDays.monday.checked && (
                                  <Button
                                    onClick={this.addWorkTime}
                                    data-day="monday"
                                    size="mini"
                                    compact
                                    color="blue"
                                    icon
                                    labelPosition="left"
                                  >
                                    <Icon name="plus" />
                                    Adicionar
                                  </Button>
                                )}
                              </Table.Cell>
                              {/* Tuesday */}
                              <Table.Cell>
                                {this.state.workingDays.tuesday.checked &&
                                  this.state.workingDays.tuesday.workingHours.map(
                                    (h, index) => (
                                      <span
                                        className="company-config-time"
                                        key={index}
                                      >
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.start)}
                                          size="small"
                                          className="company-config-time-start"
                                          id={"tuesday-" + index + "-start"}
                                        />{" "}
                                        às{" "}
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.end)}
                                          size="small"
                                          className="company-config-time-end"
                                          id={"tuesday-" + index + "-end"}
                                        />
                                        <Button
                                          size="mini"
                                          compact
                                          icon
                                          labelPosition="left"
                                          onClick={this.removeWorkTime}
                                          data-day="tuesday"
                                          data-index={index}
                                        >
                                          <Icon name="delete" />
                                          Remover
                                        </Button>
                                      </span>
                                    )
                                  )}
                                {!this.state.workingDays.tuesday.checked && (
                                  <span>Não há expediente</span>
                                )}
                                {this.state.workingDays.tuesday.checked && (
                                  <Button
                                    onClick={this.addWorkTime}
                                    data-day="tuesday"
                                    size="mini"
                                    compact
                                    color="blue"
                                    icon
                                    labelPosition="left"
                                  >
                                    <Icon name="plus" />
                                    Adicionar
                                  </Button>
                                )}
                              </Table.Cell>
                              {/* Wednesday */}
                              <Table.Cell>
                                {this.state.workingDays.wednesday.checked &&
                                  this.state.workingDays.wednesday.workingHours.map(
                                    (h, index) => (
                                      <span
                                        className="company-config-time"
                                        key={index}
                                      >
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.start)}
                                          size="small"
                                          className="company-config-time-start"
                                          id={"wednesday-" + index + "-start"}
                                        />{" "}
                                        às{" "}
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.end)}
                                          size="small"
                                          className="company-config-time-end"
                                          id={"wednesday-" + index + "-end"}
                                        />
                                        <Button
                                          size="mini"
                                          compact
                                          icon
                                          labelPosition="left"
                                          onClick={this.removeWorkTime}
                                          data-day="wednesday"
                                          data-index={index}
                                        >
                                          <Icon name="delete" />
                                          Remover
                                        </Button>
                                      </span>
                                    )
                                  )}
                                {!this.state.workingDays.wednesday.checked && (
                                  <span>Não há expediente</span>
                                )}
                                {this.state.workingDays.wednesday.checked && (
                                  <Button
                                    onClick={this.addWorkTime}
                                    data-day="wednesday"
                                    size="mini"
                                    compact
                                    color="blue"
                                    icon
                                    labelPosition="left"
                                  >
                                    <Icon name="plus" />
                                    Adicionar
                                  </Button>
                                )}
                              </Table.Cell>
                              {/* Thursday */}
                              <Table.Cell>
                                {this.state.workingDays.thursday.checked &&
                                  this.state.workingDays.thursday.workingHours.map(
                                    (h, index) => (
                                      <span
                                        className="company-config-time"
                                        key={index}
                                      >
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.start)}
                                          size="small"
                                          className="company-config-time-start"
                                          id={"thursday-" + index + "-start"}
                                        />{" "}
                                        às{" "}
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.end)}
                                          size="small"
                                          className="company-config-time-end"
                                          id={"thursday-" + index + "-end"}
                                        />
                                        <Button
                                          size="mini"
                                          compact
                                          icon
                                          labelPosition="left"
                                          onClick={this.removeWorkTime}
                                          data-day="thursday"
                                          data-index={index}
                                        >
                                          <Icon name="delete" />
                                          Remover
                                        </Button>
                                      </span>
                                    )
                                  )}
                                {!this.state.workingDays.thursday.checked && (
                                  <span>Não há expediente</span>
                                )}
                                {this.state.workingDays.thursday.checked && (
                                  <Button
                                    onClick={this.addWorkTime}
                                    data-day="thursday"
                                    size="mini"
                                    compact
                                    color="blue"
                                    icon
                                    labelPosition="left"
                                  >
                                    <Icon name="plus" />
                                    Adicionar
                                  </Button>
                                )}
                              </Table.Cell>
                              {/* Friday */}
                              <Table.Cell>
                                {this.state.workingDays.friday.checked &&
                                  this.state.workingDays.friday.workingHours.map(
                                    (h, index) => (
                                      <span
                                        className="company-config-time"
                                        key={index}
                                      >
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.start)}
                                          size="small"
                                          className="company-config-time-start"
                                          id={"friday-" + index + "-start"}
                                        />{" "}
                                        às{" "}
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.end)}
                                          size="small"
                                          className="company-config-time-end"
                                          id={"friday-" + index + "-end"}
                                        />
                                        <Button
                                          size="mini"
                                          compact
                                          icon
                                          labelPosition="left"
                                          onClick={this.removeWorkTime}
                                          data-day="friday"
                                          data-index={index}
                                        >
                                          <Icon name="delete" />
                                          Remover
                                        </Button>
                                      </span>
                                    )
                                  )}
                                {!this.state.workingDays.friday.checked && (
                                  <span>Não há expediente</span>
                                )}
                                {this.state.workingDays.friday.checked && (
                                  <Button
                                    onClick={this.addWorkTime}
                                    data-day="friday"
                                    size="mini"
                                    compact
                                    color="blue"
                                    icon
                                    labelPosition="left"
                                  >
                                    <Icon name="plus" />
                                    Adicionar
                                  </Button>
                                )}
                              </Table.Cell>
                              {/* Saturday */}
                              <Table.Cell>
                                {this.state.workingDays.saturday.checked &&
                                  this.state.workingDays.saturday.workingHours.map(
                                    (h, index) => (
                                      <span
                                        className="company-config-time"
                                        key={index}
                                      >
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.start)}
                                          size="small"
                                          className="company-config-time-start"
                                          id={"saturday-" + index + "-start"}
                                        />{" "}
                                        às{" "}
                                        <Input
                                          onChange={this.handleWorkTime}
                                          value={formatHour(h.end)}
                                          size="small"
                                          className="company-config-time-end"
                                          id={"saturday-" + index + "-end"}
                                        />
                                        <Button
                                          size="mini"
                                          compact
                                          icon
                                          labelPosition="left"
                                          onClick={this.removeWorkTime}
                                          data-day="saturday"
                                          data-index={index}
                                        >
                                          <Icon name="delete" />
                                          Remover
                                        </Button>
                                      </span>
                                    )
                                  )}
                                {!this.state.workingDays.saturday.checked && (
                                  <span>Não há expediente</span>
                                )}
                                {this.state.workingDays.saturday.checked && (
                                  <Button
                                    onClick={this.addWorkTime}
                                    data-day="saturday"
                                    size="mini"
                                    compact
                                    color="blue"
                                    icon
                                    labelPosition="left"
                                  >
                                    <Icon name="plus" />
                                    Adicionar
                                  </Button>
                                )}
                              </Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                        {this.state.errors.workingDays.map((error, index) => (
                          <ValidationError
                            key={index}
                            show={error.error}
                            error={error.msg}
                          />
                        ))}

                        <Divider style={{ marginTop: "40px" }} />
                        <Button
                          icon
                          labelPosition="left"
                          color="green"
                          type="submit"
                        >
                          <Icon name="cloud" />
                          Salvar
                        </Button>
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
    setCompany: company => dispatch(setCompany(company)),
    setCompanyLogo: logo => dispatch(setCompanyLogo(logo))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyConfig);
