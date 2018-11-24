import React, { Component } from "react";
import { Input, Button } from "semantic-ui-react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import { connect } from "react-redux";
import { addClient, allClients } from "../dashboardActions";
import axios from "axios";
import config from "../../../config";

const mapStateToProps = state => {
  return {
    clients: state.client.clients
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addClient: client => dispatch(addClient(client)),
    allClients: clients => dispatch(allClients(clients))
  };
};

class Clients extends Component {
  state = {
    email: "",
    firstName: "",
    lastName: ""
  };

  componentDidMount() {
    axios
      .get(config.api + "/clients/")
      .then(response => {
        this.props.allClients(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      })
      .then(() => {
        // always executed
      });
  }

  handleSubmit = e => {
    e.preventDefault();
    axios
      .post(config.api + "/clients/", this.state)
      .then(response => {
        this.props.addClient(this.state);
      })
      .catch(error => {
        // handle error
        console.log(error);
      })
      .then(() => {
        // always executed
      });
  };

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    const { clients } = this.props;
    return (
      <div className="clients">
        <DashboardHeader
          icon="user outline"
          title="Clientes"
          subtitle="Administre seus clientes"
        />
        <ul>
          {clients &&
            clients.map(client => {
              return (
                <li id={"client_" + client.email} key={client.email}>
                  {client.firstName} {client.lastName} - {client.email}
                </li>
              );
            })}
        </ul>

        <form onSubmit={this.handleSubmit}>
          <Input placeholder="Email" id="email" onChange={this.handleChange} />
          <Input
            placeholder="Nome"
            id="firstName"
            onChange={this.handleChange}
          />
          <Input
            placeholder="Sobrenome"
            id="lastName"
            onChange={this.handleChange}
          />
          <Button type="submit">Add Client</Button>
        </form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Clients);
