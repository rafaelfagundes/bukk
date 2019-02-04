import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "react-spinkit";
import FormTitle from "../Common/FormTitle";
import FormSubTitle from "../Common/FormSubTitle";
import {
  Divider,
  Button,
  Icon,
  Table,
  Checkbox,
  Input
} from "semantic-ui-react";
import { formatHour } from "../utils";
import Axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import Notification from "../Notification/Notification";
export class TimeTable extends Component {
  state = {
    loading: false,
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
    }
  };

  componentDidMount() {
    const mapWeekdays = {
      sun: "sunday",
      mon: "monday",
      tue: "tuesday",
      wed: "wednesday",
      thu: "thursday",
      fri: "friday",
      sat: "saturday"
    };

    const _employee = JSON.parse(localStorage.getItem("employee"));
    const _workingDays = JSON.parse(JSON.stringify(this.state.workingDays));
    _employee.workingDays.forEach(wd => {
      _workingDays[mapWeekdays[wd.weekDay]].checked = true;
      _workingDays[mapWeekdays[wd.weekDay]].workingHours = wd.workingHours;
    });

    this.setState({
      workingDays: _workingDays
    });
  }

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

  handleEmployeeTimeTable = () => {
    this.setState({ loading: true });
    let _employee = JSON.parse(localStorage.getItem("employee"));
    _employee.workingDays = [];

    for (let wd in this.state.workingDays) {
      const item = this.state.workingDays[wd];
      if (item.checked && item.workingHours.length > 0) {
        _employee.workingDays.push({
          workingHours: item.workingHours,
          weekDay: item.weekDayId
        });
      }
    }
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.patch(config.api + "/specialists/update", _employee, requestConfig)
      .then(response => {
        toast(
          <Notification
            type="success"
            title="Horários atualizados"
            text="Os horários já estão disponíveis para agendamento"
          />
        );
        localStorage.setItem("employee", JSON.stringify(_employee));
        this.setState({ loading: false });
      })
      .catch(error => {
        toast(
          <Notification
            type="error"
            title="Erro ao atualizar horários"
            text="Os horários não puderam ser atualizados. Tente novamente."
          />
        );
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <div>
        <FormTitle text="Horários" first />

        <FormSubTitle
          text="Selecione os horários que você trabalha pela empresa"
          first
        />

        <Table celled className="profile-timetable">
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
              <Table.Cell>
                {this.state.workingDays.sunday.checked &&
                  this.state.workingDays.sunday.workingHours.map((h, index) => (
                    <span className="profile-config-time" key={index}>
                      <Input
                        onChange={this.handleWorkTime}
                        value={formatHour(h.start)}
                        size="small"
                        className="profile-config-time-start"
                        id={"sunday-" + index + "-start"}
                      />{" "}
                      às{" "}
                      <Input
                        onChange={this.handleWorkTime}
                        value={formatHour(h.end)}
                        size="small"
                        className="profile-config-time-end"
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
                  ))}
                {!this.state.workingDays.sunday.checked && (
                  <span>Não trabalha</span>
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
                  this.state.workingDays.monday.workingHours.map((h, index) => (
                    <span className="profile-config-time" key={index}>
                      <Input
                        onChange={this.handleWorkTime}
                        value={formatHour(h.start)}
                        size="small"
                        className="profile-config-time-start"
                        id={"monday-" + index + "-start"}
                      />{" "}
                      às{" "}
                      <Input
                        onChange={this.handleWorkTime}
                        value={formatHour(h.end)}
                        size="small"
                        className="profile-config-time-end"
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
                  ))}
                {!this.state.workingDays.monday.checked && (
                  <span>Não trabalha</span>
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
                      <span className="profile-config-time" key={index}>
                        <Input
                          onChange={this.handleWorkTime}
                          value={formatHour(h.start)}
                          size="small"
                          className="profile-config-time-start"
                          id={"tuesday-" + index + "-start"}
                        />{" "}
                        às{" "}
                        <Input
                          onChange={this.handleWorkTime}
                          value={formatHour(h.end)}
                          size="small"
                          className="profile-config-time-end"
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
                  <span>Não trabalha</span>
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
                      <span className="profile-config-time" key={index}>
                        <Input
                          onChange={this.handleWorkTime}
                          value={formatHour(h.start)}
                          size="small"
                          className="profile-config-time-start"
                          id={"wednesday-" + index + "-start"}
                        />{" "}
                        às{" "}
                        <Input
                          onChange={this.handleWorkTime}
                          value={formatHour(h.end)}
                          size="small"
                          className="profile-config-time-end"
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
                  <span>Não trabalha</span>
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
                      <span className="profile-config-time" key={index}>
                        <Input
                          onChange={this.handleWorkTime}
                          value={formatHour(h.start)}
                          size="small"
                          className="profile-config-time-start"
                          id={"thursday-" + index + "-start"}
                        />{" "}
                        às{" "}
                        <Input
                          onChange={this.handleWorkTime}
                          value={formatHour(h.end)}
                          size="small"
                          className="profile-config-time-end"
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
                  <span>Não trabalha</span>
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
                  this.state.workingDays.friday.workingHours.map((h, index) => (
                    <span className="profile-config-time" key={index}>
                      <Input
                        onChange={this.handleWorkTime}
                        value={formatHour(h.start)}
                        size="small"
                        className="profile-config-time-start"
                        id={"friday-" + index + "-start"}
                      />{" "}
                      às{" "}
                      <Input
                        onChange={this.handleWorkTime}
                        value={formatHour(h.end)}
                        size="small"
                        className="profile-config-time-end"
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
                  ))}
                {!this.state.workingDays.friday.checked && (
                  <span>Não trabalha</span>
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
                      <span className="profile-config-time" key={index}>
                        <Input
                          onChange={this.handleWorkTime}
                          value={formatHour(h.start)}
                          size="small"
                          className="profile-config-time-start"
                          id={"saturday-" + index + "-start"}
                        />{" "}
                        às{" "}
                        <Input
                          onChange={this.handleWorkTime}
                          value={formatHour(h.end)}
                          size="small"
                          className="profile-config-time-end"
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
                  <span>Não trabalha</span>
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
        <Divider style={{ marginTop: "40px" }} />
        <Button
          icon
          labelPosition="left"
          color="green"
          disabled={this.state.loading}
          onClick={this.handleEmployeeTimeTable}
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    company: state.dashboard.company
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeTable);
