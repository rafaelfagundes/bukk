import React, { Component } from "react";
import { connect } from "react-redux";
import config from "../../config";
import Axios from "axios";
import ComponentTopMenu from "../Common/ComponentTopMenu";
import { General } from "./General";
import { Appointments } from "./Appointments";
import { Notes } from "./Notes";

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
    activeItem: "notas",
    menuItems: undefined
  };

  handleMenuClick = name => {
    this.setState({ activeItem: name });
  };

  componentDidMount() {
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
        this.setState({ client: response.data, menuItems });
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
          <General client={this.state.client} history={this.props.history} />
        )}
        {activeItem === "agendamentos" && <Appointments />}
        {activeItem === "notas" && <Notes />}
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Client);
