import React, { Component } from "react";
import { Input, Button } from "semantic-ui-react";
import DashboardHeader from "../BukkUI/DashboardHeader/DashboardHeader";
import { connect } from "react-redux";
import { addClient } from "./clientActions";

const mapStateToProps = state => {
  return {
    clients: state.client.clients
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addClient: client => dispatch(addClient(client))
  };
};

class Clients extends Component {
  state = {
    email: "",
    firstName: "",
    lastName: ""
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.addClient(this.state);
  };

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    const { clients } = this.state;
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
                <li id={"client_" + client.id} key={client.id}>
                  {client.firstName} {client.lastName} - {client.email}
                </li>
              );
            })}
        </ul>

        <form onSubmit={this.handleSubmit}>
          <Input placeholder="Email" id="email" onChange={this.handleChange} />
          <Input
            placeholder="Nome"
            id="fistName"
            onChange={this.handleChange}
          />
          <Input
            placeholder="Sobrenome"
            id="lastName"
            onChange={this.handleChange}
          />
          <Input placeholder="ID" id="id" onChange={this.handleChange} />
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
