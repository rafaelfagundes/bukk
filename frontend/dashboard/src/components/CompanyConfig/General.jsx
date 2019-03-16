/* eslint no-loop-func: 0 */
import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { toast } from "react-toastify";
import Spinner from "react-spinkit";
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
import { setCompany, setCompanyLogo } from "../dashboardActions";
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

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const CompanyConfigGeneral = styled.div`
  @media (min-width: 1441px) {
    /* limit some compenents width on full hd resolutions*/
    max-width: calc(50vw + 200px) !important;
  }
`;

const CompanyLogo = styled.div`
  display: block;

  > canvas {
    background-color: #ccc;
    padding: 20px;
    border-radius: 4px;
    display: block;
    max-width: 700px;
  }
  > span {
    display: block;
    padding: 5px 0 20px 0;
    color: rgb(102, 97, 143);
  }
`;

const PaymentTypesHolder = styled.div`
  display: flex;
  flex-direction: row;
  width: 1000px;
`;

const PaymentType = styled.div`
  display: flex;
  flex-direction: column;
  width: 128px;
  box-sizing: border-box;
  margin-right: 14px;

  > img {
    width: 128px;
    height: 128px;
    margin: 0 auto;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 2px solid #f5f5f5;
    cursor: pointer;
  }
  > label {
    padding-left: 23px !important;
    font-size: 0.9rem !important;
  }
  > :last-child {
    margin-right: 0px;
  }
  > .checkbox {
    margin: 0 auto !important;
  }
`;

const TimeTable = styled(Table)``;

const TimeTableInput = styled(Input)`
  > input {
    text-align: center !important;
  }
  > input:last-child {
    margin-bottom: 5px !important;
  }
`;

const TimeTableButton = styled(Button)`
  width: 100% !important;
`;

const TimeBlock = styled.span`
  display: block;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(34, 36, 38, 0.1);
`;

/* ============================================================================ */

const errorList = {
  general: [],
  address: [],
  contact: [],
  paymentTypes: { msg: "", error: false },
  workingDays: []
};

class General extends Component {
  state = {
    activeItem: "geral",
    loading: false,
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
        boleto: {
          enabled: false,
          name: "Boleto",
          id: "boleto",
          icon:
            "https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/boleto.png"
        },
        cash: {
          enabled: false,
          name: "Dinheiro",
          id: "cash",
          icon:
            "https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/cash.png"
        },
        debitCard: {
          enabled: false,
          name: "Cartão de Débito",
          id: "debitCard",
          icon:
            "https://res.cloudinary.com/bukkapp/image/upload/v1547692315/Bukk/Assets/Payment%20Icons/debitcard.png"
        },
        wireTransfer: {
          enabled: false,
          name: "Transferência",
          id: "wireTransfer",
          icon:
            "https://res.cloudinary.com/bukkapp/image/upload/v1547692316/Bukk/Assets/Payment%20Icons/transfer.png"
        }
      }
    },
    workingDays: {
      sunday: {
        checked: false,
        workingHours: [],
        weekDayId: "sun"
      },
      monday: {
        checked: false,
        workingHours: [],
        weekDayId: "mon"
      },
      tuesday: {
        checked: false,
        workingHours: [],
        weekDayId: "tue"
      },
      wednesday: {
        checked: false,
        workingHours: [],
        weekDayId: "wed"
      },
      thursday: {
        checked: false,
        workingHours: [],
        weekDayId: "thu"
      },
      friday: {
        checked: false,
        workingHours: [],
        weekDayId: "fri"
      },
      saturday: {
        checked: false,
        workingHours: [],
        weekDayId: "sat"
      }
    },
    states: [],
    cities: [],
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
        start: formatHour(_value),
        end: this.state.workingDays[_day].workingHours[_index].end
      };
    } else {
      _item = {
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

  handlePaymentType = (e, type) => {
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
        [type]: {
          ...this.state.paymentTypes[type],
          [_id]: {
            ...this.state.paymentTypes[type][_id],
            enabled: _checked
          }
        }
      }
    });
  };

  handlePaymentTypeCc = e => {
    this.handlePaymentType(e, "cc");
  };

  handlePaymentTypeOther = e => {
    this.handlePaymentType(e, "other");
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

  populateCities = state => {
    this.getStates(state);
  };

  handleAddressValue = (e, { id, value }) => {
    if (id === "state") {
      this.populateCities(value);
    }

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
      _errors.general.push({ msg: "Por favor, preencha o Nome Fantasia" });
    }
    if (validator.isEmpty(this.state.company.companyNickname)) {
      _errorsCount++;
      _errors.general.push({ msg: "Por favor, preencha o Nome Curto" });
    }
    if (validator.isEmpty(this.state.company.cpfCnpj)) {
      _errorsCount++;
      _errors.general.push({
        msg:
          this.state.company.businessType === "J"
            ? "Por favor, preencha o CNPJ"
            : "Por favor, preencha o CPF"
      });
    }
    if (this.state.company.businessType === "J") {
      if (!isCNPJ(this.state.company.cpfCnpj)) {
        _errorsCount++;
        _errors.general.push({ msg: "CNPJ inválido" });
      }
      if (validator.isEmpty(this.state.company.companyName)) {
        _errorsCount++;
        _errors.general.push({ msg: "Por favor, preencha a Razão Social" });
      }
    } else {
      if (!isCPF(this.state.company.cpfCnpj)) {
        _errorsCount++;
        _errors.general.push({ msg: "CPF inválido" });
      }
    }

    /* ====================================================
     Endereço
    ==================================================== */
    if (validator.isEmpty(this.state.company.address.street)) {
      _errorsCount++;
      _errors.address.push({ msg: "Por favor, preencha o Logradouro" });
    }
    if (validator.isEmpty(this.state.company.address.number)) {
      _errorsCount++;
      _errors.address.push({
        msg: "Por favor, preencha o Número"
      });
    }
    if (validator.isEmpty(this.state.company.address.neighborhood)) {
      _errorsCount++;
      _errors.address.push({ msg: "Por favor, preencha o Bairro" });
    }
    if (validator.isEmpty(this.state.company.address.city)) {
      _errorsCount++;
      _errors.address.push({ msg: "Por favor, preencha a Cidade" });
    }
    if (validator.isEmpty(this.state.company.address.postalCode)) {
      _errorsCount++;
      _errors.address.push({ msg: "Por favor, preencha a Cidade" });
    }
    if (!isPostalCode(this.state.company.address.postalCode)) {
      _errorsCount++;
      _errors.address.push({ msg: "CEP inválido" });
    }
    if (this.state.company.address.state === "") {
      _errorsCount++;
      _errors.address.push({ msg: "Por favor, selecione o Estado" });
    }

    /* ====================================================
     Contato
    ==================================================== */
    if (
      !validator.isEmpty(this.state.company.website) &&
      !validator.isURL(this.state.company.website)
    ) {
      _errorsCount++;
      _errors.contact.push({ msg: "O endereço do site é inválido" });
    }
    if (
      !validator.isEmpty(this.state.company.email) &&
      !validator.isEmail(this.state.company.email)
    ) {
      _errorsCount++;
      _errors.contact.push({ msg: "O email é inválido" });
    }

    this.state.company.phone.forEach(phone => {
      if (phone.phoneType === "cellphone") {
        if (
          !validator.isEmpty(phone.number) &&
          !isMobilePhoneWithDDD(phone.number)
        ) {
          _errorsCount++;
          _errors.contact.push({ msg: "O telefone celular é inválido" });
        }
      } else {
        if (!validator.isEmpty(phone.number) && !isPhoneWithDDD(phone.number)) {
          _errorsCount++;
          _errors.contact.push({ msg: "O telefone fixo é inválido" });
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
        if (this.state.workingDays[key].workingHours.length === 0) {
          _errors.workingDays.push({
            error: true,
            msg: `${mapWeekDays[key].charAt(0).toUpperCase() +
              mapWeekDays[key].slice(
                1
              )} não possui nenhum horário. Adicione ao menos 1 (um), ou desmarque o dia.`
          });
          _errorsCount++;
        } else {
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
    this.setState({ loading: true });
    if (!this.validateCompany()) {
      return false;
    }

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    const _company = JSON.parse(JSON.stringify(this.state.company));

    _company.paymentOptions = [];
    for (let type in this.state.paymentTypes) {
      for (let key in this.state.paymentTypes[type]) {
        if (this.state.paymentTypes[type][key].enabled) {
          const payment = this.state.paymentTypes[type][key];
          _company.paymentOptions.push({
            icon: payment.icon,
            name: payment.name,
            paymentId: payment.id,
            paymentType: type
          });
        }
      }
    }
    _company.workingDays = [];

    for (let wd in this.state.workingDays) {
      const item = this.state.workingDays[wd];
      if (item.checked && item.workingHours.length > 0) {
        _company.workingDays.push({
          workingHours: item.workingHours,
          weekDay: item.weekDayId
        });
      }
    }

    if (this.imageInput.value) {
      const data = new FormData(e.currentTarget);

      Axios.post(config.api + "/images/logo", data, requestConfig)
        .then(response => {
          this.props.setCompanyLogo(response.data.logoUrl);
          _company.logo = response.data.logoUrl;

          this.callUpdate(_company, requestConfig);
        })
        .catch(err => {
          this.setState({ loading: false });
          toast(
            <Notification
              type="error"
              title="Erro ao atualizar imagem"
              text={err.response.data.msg}
            />
          );
        });
      e.currentTarget.reset();
    } else {
      this.callUpdate(_company, requestConfig);
    }
  };

  callUpdate = (_company, requestConfig, _notification) => {
    Axios.post(config.api + "/companies/update", _company, requestConfig)
      .then(response => {
        toast(
          <Notification
            type="success"
            title="Dados atualizados com sucesso"
            text="Os dados da empresa foram atualizados"
          />
        );
        this.props.setCompany(_company);
        this.setState({ loading: false, company: _company });
        localStorage.setItem("company", JSON.stringify(_company));
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

  getStates = () => {
    Axios.get(config.api + "/utils/getstates")
      .then(response => {
        let _states = [];
        response.data.states.forEach(state => {
          _states.push({
            key: state.abbr,
            text: state.name,
            value: state.name
          });
        });
        this.setState({ states: _states });
      })
      .catch();
  };

  getCities = () => {
    Axios.get(config.api + "/utils/getcities", {
      params: {
        state: this.state.company.address.state
      }
    })
      .then(response => {
        let _cities = [];
        response.data.cities.forEach(city => {
          _cities.push({
            key: city,
            text: city,
            value: city
          });
        });
        this.setState({ cities: _cities });
      })
      .catch();
  };

  componentDidMount() {
    if (this.state.company === undefined && this.props.company) {
      this.setState({ company: this.props.company }, () => {
        let _state = {
          paymentTypes: this.state.paymentTypes,
          workingDays: this.state.workingDays
        };

        this.state.company.paymentOptions.forEach(pt => {
          _state = {
            ..._state,
            paymentTypes: {
              ..._state.paymentTypes,
              [pt.paymentType]: {
                ..._state.paymentTypes[pt.paymentType],
                [pt.paymentId]: {
                  ..._state.paymentTypes[pt.paymentType][pt.paymentId],
                  enabled: true
                }
              }
            }
          };
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
                    workingHours: wd.workingHours,
                    weekDayId: wd.weekDay
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
                    workingHours: wd.workingHours,
                    weekDayId: wd.weekDay
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
                    workingHours: wd.workingHours,
                    weekDayId: wd.weekDay
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
                    workingHours: wd.workingHours,
                    weekDayId: wd.weekDay
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
                    workingHours: wd.workingHours,
                    weekDayId: wd.weekDay
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
                    workingHours: wd.workingHours,
                    weekDayId: wd.weekDay
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
                    workingHours: wd.workingHours,
                    weekDayId: wd.weekDay
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
      if (!this.state.cities.length) {
        setTimeout(() => {
          this.getStates();
          this.getCities(this.state.company.address.state);
        }, 500);
      }
    }
  }

  componentDidUpdate() {
    // Load logo on Canvas
    if (this.state.company !== undefined && this.canvasLogo) {
      // if (!this.state.cities.length) {
      //   setTimeout(() => {
      //     this.getStates();
      //     this.getCities(this.state.company.address.state);
      //   }, 250);
      // }
      this.canvasLogo.style.backgroundColor = this.state.company.settings.colors.primaryBack;

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
          <CompanyConfigGeneral>
            <Form
              ref={formCompany => (this.formCompany = formCompany)}
              onSubmit={this.saveCompanyInfo}
            >
              <FormTitle text="Logotipo" first />
              <CompanyLogo>
                <canvas
                  id="company-config-logo-canvas"
                  ref={canvasLogo => (this.canvasLogo = canvasLogo)}
                  height="10"
                  width="10"
                />
                <span>
                  <strong>Dica:</strong> A cor de fundo acima é a mesma de onde
                  seu logotipo será exibido, portanto tente deixar seu logo bem
                  visível.
                </span>
                <label className="ui blue compact button" htmlFor="logo-image">
                  <Icon name="pencil" />
                  Alterar Logotipo
                </label>
                <input
                  type="file"
                  name="logo-image"
                  id="logo-image"
                  onChange={this.handleLogo}
                  ref={imageInput => (this.imageInput = imageInput)}
                  hidden
                />
              </CompanyLogo>
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
                label={this.state.company.businessType === "J" ? "CNPJ" : "CPF"}
                value={
                  this.state.company.businessType === "J"
                    ? formatCnpj(this.state.company.cpfCnpj)
                    : formatCpf(this.state.company.cpfCnpj)
                }
                onChange={this.handleChange}
                id="cpfCnpj"
                width={4}
              />

              {this.state.errors.general.map((error, index) => (
                <ValidationError key={index} show={true} error={error.msg} />
              ))}

              <FormTitle text="Endereço" />

              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Logradouro"
                  placeholder="Logradouro"
                  width="9"
                  value={this.state.company.address.street}
                  onChange={this.handleAddressValue}
                  id="street"
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
                  value={formatCEP(this.state.company.address.postalCode)}
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
                <Form.Select
                  fluid
                  label="Estado"
                  options={this.state.states}
                  placeholder="Estado"
                  width="4"
                  onChange={this.handleAddressValue}
                  id="state"
                  value={this.state.company.address.state}
                  search
                />
                <Form.Select
                  fluid
                  label="Cidade"
                  options={this.state.cities}
                  placeholder="Cidade"
                  width="4"
                  onChange={this.handleAddressValue}
                  id="city"
                  value={this.state.company.address.city}
                  search
                />
              </Form.Group>

              {this.state.errors.address.map((error, index) => (
                <ValidationError key={index} show={true} error={error.msg} />
              ))}

              <FormTitle text="Contato" />
              <Form.Group>
                <Form.Input
                  label="Email"
                  value={this.state.company.email}
                  width={8}
                  onChange={this.handleChange}
                  id="email"
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  label="Site"
                  value={this.state.company.website}
                  width={8}
                  onChange={this.handleChange}
                  id="website"
                />
              </Form.Group>
              <FormGroup widths={4}>
                {this.state.company.phone.map((phone, index) => (
                  <Form.Input
                    key={index}
                    label={
                      phone.phoneType === "landline"
                        ? "Telefone fixo"
                        : "Telefone celular"
                    }
                    value={formatBrazilianPhoneNumber(phone.number)}
                    onChange={this.handlePhone}
                    id={phone.phoneType}
                  />
                ))}
              </FormGroup>

              {this.state.errors.contact.map((error, index) => (
                <ValidationError key={index} show={true} error={error.msg} />
              ))}

              <FormTitle text="Formas de Pagamento" />
              <FormSubTitle text="Cartões de Crédito" first />
              <PaymentTypesHolder>
                <PaymentType>
                  <img
                    src={this.state.paymentTypes.cc.amex.icon}
                    alt={this.state.paymentTypes.cc.amex.name}
                    onClick={this.handlePaymentTypeCc}
                    id={this.state.paymentTypes.cc.amex.id + "-img"}
                    checked={this.state.paymentTypes.cc.amex.enabled}
                  />
                  <Checkbox
                    label={this.state.paymentTypes.cc.amex.name}
                    checked={this.state.paymentTypes.cc.amex.enabled}
                    id={this.state.paymentTypes.cc.amex.id}
                    onChange={this.handlePaymentTypeCc}
                  />
                </PaymentType>
                <PaymentType>
                  <img
                    src={this.state.paymentTypes.cc.dinersclub.icon}
                    alt={this.state.paymentTypes.cc.dinersclub.name}
                    onClick={this.handlePaymentTypeCc}
                    id={this.state.paymentTypes.cc.dinersclub.id + "-img"}
                    checked={this.state.paymentTypes.cc.dinersclub.enabled}
                  />
                  <Checkbox
                    label={this.state.paymentTypes.cc.dinersclub.name}
                    checked={this.state.paymentTypes.cc.dinersclub.enabled}
                    id={this.state.paymentTypes.cc.dinersclub.id}
                    onChange={this.handlePaymentTypeCc}
                  />
                </PaymentType>
                <PaymentType>
                  <img
                    src={this.state.paymentTypes.cc.discover.icon}
                    alt={this.state.paymentTypes.cc.discover.name}
                    onClick={this.handlePaymentTypeCc}
                    id={this.state.paymentTypes.cc.discover.id + "-img"}
                    checked={this.state.paymentTypes.cc.discover.enabled}
                  />
                  <Checkbox
                    label={this.state.paymentTypes.cc.discover.name}
                    checked={this.state.paymentTypes.cc.discover.enabled}
                    id={this.state.paymentTypes.cc.discover.id}
                    onChange={this.handlePaymentTypeCc}
                  />
                </PaymentType>
                <PaymentType>
                  <img
                    src={this.state.paymentTypes.cc.elo.icon}
                    alt={this.state.paymentTypes.cc.elo.name}
                    onClick={this.handlePaymentTypeCc}
                    id={this.state.paymentTypes.cc.elo.id + "-img"}
                    checked={this.state.paymentTypes.cc.elo.enabled}
                  />
                  <Checkbox
                    label={this.state.paymentTypes.cc.elo.name}
                    checked={this.state.paymentTypes.cc.elo.enabled}
                    id={this.state.paymentTypes.cc.elo.id}
                    onChange={this.handlePaymentTypeCc}
                  />
                </PaymentType>
                <PaymentType>
                  <img
                    src={this.state.paymentTypes.cc.hipercard.icon}
                    alt={this.state.paymentTypes.cc.hipercard.name}
                    onClick={this.handlePaymentTypeCc}
                    id={this.state.paymentTypes.cc.hipercard.id + "-img"}
                    checked={this.state.paymentTypes.cc.hipercard.enabled}
                  />
                  <Checkbox
                    label={this.state.paymentTypes.cc.hipercard.name}
                    checked={this.state.paymentTypes.cc.hipercard.enabled}
                    id={this.state.paymentTypes.cc.hipercard.id}
                    onChange={this.handlePaymentTypeCc}
                  />
                </PaymentType>
                <PaymentType>
                  <img
                    src={this.state.paymentTypes.cc.mastercard.icon}
                    alt={this.state.paymentTypes.cc.mastercard.name}
                    onClick={this.handlePaymentTypeCc}
                    id={this.state.paymentTypes.cc.mastercard.id + "-img"}
                    checked={this.state.paymentTypes.cc.mastercard.enabled}
                  />
                  <Checkbox
                    label={this.state.paymentTypes.cc.mastercard.name}
                    checked={this.state.paymentTypes.cc.mastercard.enabled}
                    id={this.state.paymentTypes.cc.mastercard.id}
                    onChange={this.handlePaymentTypeCc}
                  />
                </PaymentType>
                <PaymentType>
                  <img
                    src={this.state.paymentTypes.cc.visa.icon}
                    alt={this.state.paymentTypes.cc.visa.name}
                    onClick={this.handlePaymentTypeCc}
                    id={this.state.paymentTypes.cc.visa.id + "-img"}
                    checked={this.state.paymentTypes.cc.visa.enabled}
                  />
                  <Checkbox
                    label={this.state.paymentTypes.cc.visa.name}
                    checked={this.state.paymentTypes.cc.visa.enabled}
                    id={this.state.paymentTypes.cc.visa.id}
                    onChange={this.handlePaymentTypeCc}
                  />
                </PaymentType>
              </PaymentTypesHolder>
              <FormSubTitle text="Outras modalidades" />
              <PaymentTypesHolder className="company-payment-types">
                <PaymentType>
                  <img
                    src={this.state.paymentTypes.other.boleto.icon}
                    alt={this.state.paymentTypes.other.boleto.name}
                    onClick={this.handlePaymentTypeOther}
                    id={this.state.paymentTypes.other.boleto.id + "-img"}
                    checked={this.state.paymentTypes.other.boleto.enabled}
                  />
                  <Checkbox
                    label={this.state.paymentTypes.other.boleto.name}
                    checked={this.state.paymentTypes.other.boleto.enabled}
                    onChange={this.handlePaymentTypeOther}
                    id={this.state.paymentTypes.other.boleto.id}
                  />
                </PaymentType>
                <PaymentType>
                  <img
                    src={this.state.paymentTypes.other.debitCard.icon}
                    alt={this.state.paymentTypes.other.debitCard.name}
                    onClick={this.handlePaymentTypeOther}
                    id={this.state.paymentTypes.other.debitCard.id + "-img"}
                    checked={this.state.paymentTypes.other.debitCard.enabled}
                  />
                  <Checkbox
                    label={this.state.paymentTypes.other.debitCard.name}
                    checked={this.state.paymentTypes.other.debitCard.enabled}
                    onChange={this.handlePaymentTypeOther}
                    id={this.state.paymentTypes.other.debitCard.id}
                  />
                </PaymentType>
                <PaymentType>
                  <img
                    src={this.state.paymentTypes.other.cash.icon}
                    alt={this.state.paymentTypes.other.cash.name}
                    onClick={this.handlePaymentTypeOther}
                    id={this.state.paymentTypes.other.cash.id + "-img"}
                    checked={this.state.paymentTypes.other.cash.enabled}
                  />
                  <Checkbox
                    label={this.state.paymentTypes.other.cash.name}
                    checked={this.state.paymentTypes.other.cash.enabled}
                    onChange={this.handlePaymentTypeOther}
                    id={this.state.paymentTypes.other.cash.id}
                  />
                </PaymentType>
                <PaymentType>
                  <img
                    src={this.state.paymentTypes.other.wireTransfer.icon}
                    alt={this.state.paymentTypes.other.wireTransfer.name}
                    onClick={this.handlePaymentTypeOther}
                    id={this.state.paymentTypes.other.wireTransfer.id + "-img"}
                    checked={this.state.paymentTypes.other.wireTransfer.enabled}
                  />
                  <Checkbox
                    label={this.state.paymentTypes.other.wireTransfer.name}
                    checked={this.state.paymentTypes.other.wireTransfer.enabled}
                    onChange={this.handlePaymentTypeOther}
                    id={this.state.paymentTypes.other.wireTransfer.id}
                  />
                </PaymentType>
              </PaymentTypesHolder>
              <ValidationError
                show={this.state.errors.paymentTypes.error}
                error={this.state.errors.paymentTypes.msg}
              />
              <FormTitle text="Horário de Funcionamento" />
              <TimeTable celled fixed>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      <Checkbox
                        label="Domingo"
                        checked={this.state.workingDays.sunday.checked}
                        onChange={this.handleWorkDay}
                        id="sunday"
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Checkbox
                        label="Segunda"
                        checked={this.state.workingDays.monday.checked}
                        onChange={this.handleWorkDay}
                        id="monday"
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Checkbox
                        label="Terça"
                        checked={this.state.workingDays.tuesday.checked}
                        onChange={this.handleWorkDay}
                        id="tuesday"
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Checkbox
                        label="Quarta"
                        checked={this.state.workingDays.wednesday.checked}
                        onChange={this.handleWorkDay}
                        id="wednesday"
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Checkbox
                        label="Quinta"
                        checked={this.state.workingDays.thursday.checked}
                        onChange={this.handleWorkDay}
                        id="thursday"
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Checkbox
                        label="Sexta"
                        checked={this.state.workingDays.friday.checked}
                        onChange={this.handleWorkDay}
                        id="friday"
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Checkbox
                        label="Sábado"
                        checked={this.state.workingDays.saturday.checked}
                        onChange={this.handleWorkDay}
                        id="saturday"
                      />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    {/* Sunday */}
                    <Table.Cell textAlign="center">
                      {this.state.workingDays.sunday.checked &&
                        this.state.workingDays.sunday.workingHours.map(
                          (h, index) => (
                            <TimeBlock key={index}>
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.start)}
                                size="small"
                                id={"sunday-" + index + "-start"}
                              />{" "}
                              às{" "}
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.end)}
                                size="small"
                                id={"sunday-" + index + "-end"}
                              />
                              <TimeTableButton
                                size="mini"
                                compact
                                onClick={this.removeWorkTime}
                                data-day="sunday"
                                data-index={index}
                                icon="delete"
                                content="Remover"
                              />
                            </TimeBlock>
                          )
                        )}
                      {!this.state.workingDays.sunday.checked && (
                        <span>Não há expediente</span>
                      )}
                      {this.state.workingDays.sunday.checked && (
                        <TimeTableButton
                          onClick={this.addWorkTime}
                          data-day="sunday"
                          size="mini"
                          compact
                          color="blue"
                          icon="plus"
                          content="Adicionar"
                        />
                      )}
                    </Table.Cell>
                    {/* Monday */}
                    <Table.Cell textAlign="center">
                      {this.state.workingDays.monday.checked &&
                        this.state.workingDays.monday.workingHours.map(
                          (h, index) => (
                            <TimeBlock key={index}>
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.start)}
                                size="small"
                                id={"monday-" + index + "-start"}
                              />{" "}
                              às{" "}
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.end)}
                                size="small"
                                id={"monday-" + index + "-end"}
                              />
                              <TimeTableButton
                                size="mini"
                                compact
                                onClick={this.removeWorkTime}
                                data-day="monday"
                                data-index={index}
                                icon="delete"
                                content="Remover"
                              />
                            </TimeBlock>
                          )
                        )}
                      {!this.state.workingDays.monday.checked && (
                        <span>Não há expediente</span>
                      )}
                      {this.state.workingDays.monday.checked && (
                        <TimeTableButton
                          onClick={this.addWorkTime}
                          data-day="monday"
                          size="mini"
                          compact
                          color="blue"
                          icon="plus"
                          content="Adicionar"
                        />
                      )}
                    </Table.Cell>
                    {/* Tuesday */}
                    <Table.Cell textAlign="center">
                      {this.state.workingDays.tuesday.checked &&
                        this.state.workingDays.tuesday.workingHours.map(
                          (h, index) => (
                            <TimeBlock key={index}>
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.start)}
                                size="small"
                                id={"tuesday-" + index + "-start"}
                              />{" "}
                              às{" "}
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.end)}
                                size="small"
                                id={"tuesday-" + index + "-end"}
                              />
                              <TimeTableButton
                                size="mini"
                                compact
                                onClick={this.removeWorkTime}
                                data-day="tuesday"
                                data-index={index}
                                icon="delete"
                                content="Remover"
                              />
                            </TimeBlock>
                          )
                        )}
                      {!this.state.workingDays.tuesday.checked && (
                        <span>Não há expediente</span>
                      )}
                      {this.state.workingDays.tuesday.checked && (
                        <TimeTableButton
                          onClick={this.addWorkTime}
                          data-day="tuesday"
                          size="mini"
                          compact
                          color="blue"
                          icon="plus"
                          content="Adicionar"
                        />
                      )}
                    </Table.Cell>
                    {/* Wednesday */}
                    <Table.Cell textAlign="center">
                      {this.state.workingDays.wednesday.checked &&
                        this.state.workingDays.wednesday.workingHours.map(
                          (h, index) => (
                            <TimeBlock key={index}>
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.start)}
                                size="small"
                                id={"wednesday-" + index + "-start"}
                              />{" "}
                              às{" "}
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.end)}
                                size="small"
                                id={"wednesday-" + index + "-end"}
                              />
                              <TimeTableButton
                                size="mini"
                                compact
                                onClick={this.removeWorkTime}
                                data-day="wednesday"
                                data-index={index}
                                icon="delete"
                                content="Remover"
                              />
                            </TimeBlock>
                          )
                        )}
                      {!this.state.workingDays.wednesday.checked && (
                        <span>Não há expediente</span>
                      )}
                      {this.state.workingDays.wednesday.checked && (
                        <TimeTableButton
                          onClick={this.addWorkTime}
                          data-day="wednesday"
                          size="mini"
                          compact
                          color="blue"
                          icon="plus"
                          content="Adicionar"
                        />
                      )}
                    </Table.Cell>
                    {/* Thursday */}
                    <Table.Cell textAlign="center">
                      {this.state.workingDays.thursday.checked &&
                        this.state.workingDays.thursday.workingHours.map(
                          (h, index) => (
                            <TimeBlock key={index}>
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.start)}
                                size="small"
                                id={"thursday-" + index + "-start"}
                              />{" "}
                              às{" "}
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.end)}
                                size="small"
                                id={"thursday-" + index + "-end"}
                              />
                              <TimeTableButton
                                size="mini"
                                compact
                                onClick={this.removeWorkTime}
                                data-day="thursday"
                                data-index={index}
                                icon="delete"
                                content="Remover"
                              />
                            </TimeBlock>
                          )
                        )}
                      {!this.state.workingDays.thursday.checked && (
                        <span>Não há expediente</span>
                      )}
                      {this.state.workingDays.thursday.checked && (
                        <TimeTableButton
                          onClick={this.addWorkTime}
                          data-day="thursday"
                          size="mini"
                          compact
                          color="blue"
                          icon="plus"
                          content="Adicionar"
                        />
                      )}
                    </Table.Cell>
                    {/* Friday */}
                    <Table.Cell textAlign="center">
                      {this.state.workingDays.friday.checked &&
                        this.state.workingDays.friday.workingHours.map(
                          (h, index) => (
                            <TimeBlock key={index}>
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.start)}
                                size="small"
                                id={"friday-" + index + "-start"}
                              />{" "}
                              às{" "}
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.end)}
                                size="small"
                                id={"friday-" + index + "-end"}
                              />
                              <TimeTableButton
                                size="mini"
                                compact
                                onClick={this.removeWorkTime}
                                data-day="friday"
                                data-index={index}
                                icon="delete"
                                content="Remover"
                              />
                            </TimeBlock>
                          )
                        )}
                      {!this.state.workingDays.friday.checked && (
                        <span>Não há expediente</span>
                      )}
                      {this.state.workingDays.friday.checked && (
                        <TimeTableButton
                          onClick={this.addWorkTime}
                          data-day="friday"
                          size="mini"
                          compact
                          color="blue"
                          icon="plus"
                          content="Adicionar"
                        />
                      )}
                    </Table.Cell>
                    {/* Saturday */}
                    <Table.Cell textAlign="center">
                      {this.state.workingDays.saturday.checked &&
                        this.state.workingDays.saturday.workingHours.map(
                          (h, index) => (
                            <TimeBlock key={index}>
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.start)}
                                size="small"
                                id={"saturday-" + index + "-start"}
                              />{" "}
                              às{" "}
                              <TimeTableInput
                                onChange={this.handleWorkTime}
                                value={formatHour(h.end)}
                                size="small"
                                id={"saturday-" + index + "-end"}
                              />
                              <TimeTableButton
                                size="mini"
                                compact
                                onClick={this.removeWorkTime}
                                data-day="saturday"
                                data-index={index}
                                icon="delete"
                                content="Remover"
                              />
                            </TimeBlock>
                          )
                        )}
                      {!this.state.workingDays.saturday.checked && (
                        <span>Não há expediente</span>
                      )}
                      {this.state.workingDays.saturday.checked && (
                        <TimeTableButton
                          onClick={this.addWorkTime}
                          data-day="saturday"
                          size="mini"
                          compact
                          color="blue"
                          icon="plus"
                          content="Adicionar"
                        />
                      )}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </TimeTable>
              {this.state.errors.workingDays.map((error, index) => (
                <ValidationError
                  key={index}
                  show={error.error}
                  error={error.msg}
                />
              ))}

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
          </CompanyConfigGeneral>
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
    setCompany: company => dispatch(setCompany(company)),
    setCompanyLogo: logo => dispatch(setCompanyLogo(logo))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(General);
