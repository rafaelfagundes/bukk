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
import styled from "styled-components";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const StyledTimeTable = styled(Table)`
  box-sizing: border-box;

  > td {
    text-align: center !important;
  }
`;

const ConfigTime = styled.span`
  text-align: center;
  display: flex;
  flex-direction: column;

  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(34, 36, 38, 0.1);

  > div > input {
    text-align: center !important;
    width: 100%;
  }
  > button {
    width: 100%;
    margin-top: 5px !important;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const DoesNotWork = styled.span`
  font-style: italic;
`;

const TableCell = styled(Table.Cell)`
  text-align: center !important;
`;

/* ============================================================================ */

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

        <StyledTimeTable celled fixed>
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
              <TableCell>
                {this.state.workingDays.sunday.checked &&
                  this.state.workingDays.sunday.workingHours.map((h, index) => (
                    <ConfigTime key={index}>
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
                        id={"sunday-" + index + "-end"}
                      />
                      <Button
                        size="mini"
                        compact
                        icon
                        onClick={this.removeWorkTime}
                        data-day="sunday"
                        data-index={index}
                      >
                        <Icon name="delete" />
                        Remover
                      </Button>
                    </ConfigTime>
                  ))}
                {!this.state.workingDays.sunday.checked && (
                  <DoesNotWork>Não trabalha</DoesNotWork>
                )}
                {this.state.workingDays.sunday.checked && (
                  <StyledButton
                    onClick={this.addWorkTime}
                    data-day="sunday"
                    size="mini"
                    compact
                    color="blue"
                    icon
                  >
                    <Icon name="plus" />
                    Adicionar
                  </StyledButton>
                )}
              </TableCell>
              {/* Monday */}
              <TableCell>
                {this.state.workingDays.monday.checked &&
                  this.state.workingDays.monday.workingHours.map((h, index) => (
                    <ConfigTime key={index}>
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
                        id={"monday-" + index + "-end"}
                      />
                      <Button
                        size="mini"
                        compact
                        icon
                        onClick={this.removeWorkTime}
                        data-day="monday"
                        data-index={index}
                      >
                        <Icon name="delete" />
                        Remover
                      </Button>
                    </ConfigTime>
                  ))}
                {!this.state.workingDays.monday.checked && (
                  <DoesNotWork>Não trabalha</DoesNotWork>
                )}
                {this.state.workingDays.monday.checked && (
                  <StyledButton
                    onClick={this.addWorkTime}
                    data-day="monday"
                    size="mini"
                    compact
                    color="blue"
                    icon
                  >
                    <Icon name="plus" />
                    Adicionar
                  </StyledButton>
                )}
              </TableCell>
              {/* Tuesday */}
              <TableCell>
                {this.state.workingDays.tuesday.checked &&
                  this.state.workingDays.tuesday.workingHours.map(
                    (h, index) => (
                      <ConfigTime key={index}>
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
                          id={"tuesday-" + index + "-end"}
                        />
                        <Button
                          size="mini"
                          compact
                          icon
                          onClick={this.removeWorkTime}
                          data-day="tuesday"
                          data-index={index}
                        >
                          <Icon name="delete" />
                          Remover
                        </Button>
                      </ConfigTime>
                    )
                  )}
                {!this.state.workingDays.tuesday.checked && (
                  <DoesNotWork>Não trabalha</DoesNotWork>
                )}
                {this.state.workingDays.tuesday.checked && (
                  <StyledButton
                    onClick={this.addWorkTime}
                    data-day="tuesday"
                    size="mini"
                    compact
                    color="blue"
                    icon
                  >
                    <Icon name="plus" />
                    Adicionar
                  </StyledButton>
                )}
              </TableCell>
              {/* Wednesday */}
              <TableCell>
                {this.state.workingDays.wednesday.checked &&
                  this.state.workingDays.wednesday.workingHours.map(
                    (h, index) => (
                      <ConfigTime key={index}>
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
                          id={"wednesday-" + index + "-end"}
                        />
                        <Button
                          size="mini"
                          compact
                          icon
                          onClick={this.removeWorkTime}
                          data-day="wednesday"
                          data-index={index}
                        >
                          <Icon name="delete" />
                          Remover
                        </Button>
                      </ConfigTime>
                    )
                  )}
                {!this.state.workingDays.wednesday.checked && (
                  <DoesNotWork>Não trabalha</DoesNotWork>
                )}
                {this.state.workingDays.wednesday.checked && (
                  <StyledButton
                    onClick={this.addWorkTime}
                    data-day="wednesday"
                    size="mini"
                    compact
                    color="blue"
                    icon
                  >
                    <Icon name="plus" />
                    Adicionar
                  </StyledButton>
                )}
              </TableCell>
              {/* Thursday */}
              <TableCell>
                {this.state.workingDays.thursday.checked &&
                  this.state.workingDays.thursday.workingHours.map(
                    (h, index) => (
                      <ConfigTime key={index}>
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
                          id={"thursday-" + index + "-end"}
                        />
                        <Button
                          size="mini"
                          compact
                          icon
                          onClick={this.removeWorkTime}
                          data-day="thursday"
                          data-index={index}
                        >
                          <Icon name="delete" />
                          Remover
                        </Button>
                      </ConfigTime>
                    )
                  )}
                {!this.state.workingDays.thursday.checked && (
                  <DoesNotWork>Não trabalha</DoesNotWork>
                )}
                {this.state.workingDays.thursday.checked && (
                  <StyledButton
                    onClick={this.addWorkTime}
                    data-day="thursday"
                    size="mini"
                    compact
                    color="blue"
                    icon
                  >
                    <Icon name="plus" />
                    Adicionar
                  </StyledButton>
                )}
              </TableCell>
              {/* Friday */}
              <TableCell>
                {this.state.workingDays.friday.checked &&
                  this.state.workingDays.friday.workingHours.map((h, index) => (
                    <ConfigTime key={index}>
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
                        id={"friday-" + index + "-end"}
                      />
                      <Button
                        size="mini"
                        compact
                        icon
                        onClick={this.removeWorkTime}
                        data-day="friday"
                        data-index={index}
                      >
                        <Icon name="delete" />
                        Remover
                      </Button>
                    </ConfigTime>
                  ))}
                {!this.state.workingDays.friday.checked && (
                  <DoesNotWork>Não trabalha</DoesNotWork>
                )}
                {this.state.workingDays.friday.checked && (
                  <StyledButton
                    onClick={this.addWorkTime}
                    data-day="friday"
                    size="mini"
                    compact
                    color="blue"
                    icon
                  >
                    <Icon name="plus" />
                    Adicionar
                  </StyledButton>
                )}
              </TableCell>
              {/* Saturday */}
              <TableCell>
                {this.state.workingDays.saturday.checked &&
                  this.state.workingDays.saturday.workingHours.map(
                    (h, index) => (
                      <ConfigTime key={index}>
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
                          id={"saturday-" + index + "-end"}
                        />
                        <Button
                          size="mini"
                          compact
                          icon
                          onClick={this.removeWorkTime}
                          data-day="saturday"
                          data-index={index}
                        >
                          <Icon name="delete" />
                          Remover
                        </Button>
                      </ConfigTime>
                    )
                  )}
                {!this.state.workingDays.saturday.checked && (
                  <DoesNotWork>Não trabalha</DoesNotWork>
                )}
                {this.state.workingDays.saturday.checked && (
                  <StyledButton
                    onClick={this.addWorkTime}
                    data-day="saturday"
                    size="mini"
                    compact
                    color="blue"
                    icon
                  >
                    <Icon name="plus" />
                    Adicionar
                  </StyledButton>
                )}
              </TableCell>
            </Table.Row>
          </Table.Body>
        </StyledTimeTable>
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
