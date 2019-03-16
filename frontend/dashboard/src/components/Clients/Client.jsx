import React, { Component } from "react";
import { connect } from "react-redux";
import config from "../../config";
import Axios from "axios";
import ComponentTopMenu from "../Common/ComponentTopMenu";
import General from "./General";
import Notes from "./Notes";
import Appointments from "./Appointments";
import { setCurrentPage } from "../dashboardActions";
import { Statistics } from "./Statistics";

const menuItems = [
  {
    id: "geral",
    icon: "user"
  },
  {
    id: "agendamentos",
    icon: "calendar alternate outline",
    text: "Agendamentos"
  },
  {
    id: "notas",
    icon: "pencil",
    text: "Anotações"
  }
];

export class Client extends Component {
  state = {
    client: undefined,
    activeItem: "geral",
    menuItems: undefined,
    stats: [],
    statistics: true
  };

  showStatistics = value => {
    console.log(value);
    this.setState({ statistics: value });
  };

  handleMenuClick = name => {
    this.setState({ activeItem: name });
  };

  componentDidMount() {
    this.props.setCurrentPage({
      title: "Carregando cliente...",
      icon: "hourglass half"
    });
    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    Axios.post(
      config.api + "/costumers/get",
      { id: this.props.match.params.id },
      requestConfig
    )
      .then(response => {
        const { firstName, lastName } = response.data;
        menuItems[0].text = firstName + " " + lastName;

        this.props.setCurrentPage({
          title: firstName + " " + lastName,
          icon: "user outline"
        });

        this.setState({ client: response.data, menuItems });
      })
      .catch(error => {
        console.log(error);
      });

    Axios.post(
      config.api + "/costumers/stats",
      { id: this.props.match.params.id },
      requestConfig
    )
      .then(response => {
        console.log("response.data", response.data);

        let _stats = response.data.stats;

        this.setState({
          stats: [
            {
              prefix: "",
              suffix: "",
              label: "Agendamentos",
              value: _stats.appointments,
              type: "number",
              color: "blue"
            },
            {
              prefix: "R$",
              suffix: "",
              label: "Pago",
              value: _stats.totalPayed,
              type: "currency",
              color: "teal"
            },
            {
              prefix: "R$",
              suffix: "",
              label: "Não-Pago",
              value: _stats.totalNotPayed,
              type: "currency",
              color: "yellow"
            },
            {
              prefix: "",
              suffix: "",
              label: "Cancelados",
              value: _stats.totalCanceled,
              type: "number",
              color: "red"
            },
            {
              prefix: "",
              suffix: "",
              label: "Faltas",
              value: _stats.totalMissed,
              type: "number",
              color: "orange"
            }
          ]
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        {this.state.menuItems && (
          <ComponentTopMenu
            items={this.state.menuItems}
            onClick={this.handleMenuClick}
            activeItem={activeItem}
          />
        )}

        {activeItem === "geral" && this.state.client && (
          <>
            {this.state.statistics && <Statistics stats={this.state.stats} />}
            <General
              client={this.state.client}
              history={this.props.history}
              showStatistics={this.showStatistics}
            />
          </>
        )}
        {activeItem === "agendamentos" && <Appointments {...this.props} />}
        {activeItem === "notas" && <Notes {...this.props} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentPage: state.dashboard.currentPage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Client);
