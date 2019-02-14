import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "react-spinkit";
import { toast } from "react-toastify";
import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css";
import { Button, Icon } from "semantic-ui-react";
import ValidationError from "../Common/ValidationError";
import config from "../../config";
import Axios from "axios";
import Notification from "../Notification/Notification";

const localizer = BigCalendar.momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

export class Calendar extends Component {
  state = {
    modified: false,
    loading: false,
    initialEvents: [],
    previousEvents: [],
    events: [],
    appointmentId: undefined,
    errors: []
  };

  componentDidMount() {
    this.setState({
      events: this.props.events,
      initialEvents: this.props.events
    });
  }

  handleSaveModifications = () => {
    let _appointments = [];
    let _errors = [];
    this.state.events.forEach(e => {
      let _event = moment(e.start);
      let _today = moment();

      if (_event.isBefore(_today, "hour minute")) {
        _errors.push(`"${e.title}" foi alterado para uma data no passado`);
        console.log(`"${e.title}" foi alterado para uma data no passado`);
      } else {
        _appointments.push({
          _id: e.appointmentId,
          start: e.start,
          end: e.end
        });
      }
    });

    if (_errors.length) {
      this.setState({ errors: _errors });
    } else {
      this.setState({ loading: true, errors: _errors });
      console.log(_appointments);

      const token = localStorage.getItem("token");
      let requestConfig = {
        headers: {
          Authorization: token
        }
      };

      Axios.patch(
        config.api + "/appointments/update",
        _appointments,
        requestConfig
      )
        .then(response => {
          console.log(response.data);
          this.props.updateHandler();
          toast(
            <Notification
              type="success"
              title="Agendamentos atualizados"
              text="Os agendamentos foram atualizados com sucesso"
            />
          );
          this.setState({ loading: false, modified: false });
        })
        .catch(error => {
          this.setState({ loading: false });
          toast(
            <Notification
              type="error"
              title="Erro ao atualizar agendamentos"
              text="Erro ao tentar atualizar os agendamentos"
            />
          );
        });
    }
  };

  handleCancelModifications = () => {
    this.setState({
      events: this.state.initialEvents,
      previousEvents: [],
      modified: false,
      errors: []
    });
  };

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state;

    const idx = events.indexOf(event);
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }
    console.log(start);
    console.log(end);

    const updatedEvent = { ...event, start, end, allDay };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    this.setState({
      events: nextEvents,
      previousEvents: this.state.events,
      modified: true
    });

    console.log(`${event.title} was dropped onto ${updatedEvent.start}`);
  };

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state;

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    this.setState({
      events: nextEvents
    });

    //alert(`${event.title} was resized to ${start}-${end}`)
  };

  newEvent = event => {
    console.log(event);
    // let idList = this.state.events.map(a => a.id)
    // let newId = Math.max(...idList) + 1
    // let hour = {
    //   id: newId,
    //   title: 'New Event',
    //   allDay: event.slots.length == 1,
    //   start: event.start,
    //   end: event.end,
    // }
    // this.setState({
    //   events: this.state.events.concat([hour]),
    // })
  };

  selectEvent = e => {
    this.props.history.push(`/dashboard/agendamento/id/${e.appointmentId}`);
  };

  render() {
    return (
      <div
        style={{ height: "calc(100vh - 265px)", width: "calc(100vw - 290px)" }}
      >
        <DragAndDropCalendar
          selectable
          localizer={localizer}
          events={this.state.events}
          onEventDrop={this.moveEvent}
          // resizable={false}
          // onEventResize={this.resizeEvent}
          onSelectSlot={this.newEvent}
          onSelectEvent={this.selectEvent}
          defaultView={BigCalendar.Views.WEEK}
          defaultDate={new Date()}
          min={this.props.minTime}
          max={this.props.maxTime}
          views={{ month: true, week: true, day: true }}
          messages={{
            day: "Dia",
            month: "Mês",
            week: "Semana",
            previous: "Anterior",
            next: "Próximo",
            today: "Hoje",
            agenda: "Lista",
            date: "Data",
            time: "Horário",
            event: "Agendamento"
          }}
        />
        {this.state.errors.map((error, index) => (
          <ValidationError key={index} show={true} error={error} />
        ))}

        {this.state.modified && (
          <>
            <Button
              icon
              labelPosition="left"
              color="green"
              style={{ marginTop: "15px" }}
              onClick={this.handleSaveModifications}
            >
              <Icon name="cloud" />
              Salvar Alterações
            </Button>
            <Button
              icon
              labelPosition="left"
              style={{ marginTop: "15px" }}
              floated="right"
              onClick={this.handleCancelModifications}
            >
              <Icon name="delete" />
              Cancelar Alterações
            </Button>
          </>
        )}
        {this.state.loading && (
          <Spinner
            style={{ top: "6px", left: "5px", display: "inline-block" }}
            name="circle"
            color={this.props.company.settings.colors.primaryBack}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Calendar);
