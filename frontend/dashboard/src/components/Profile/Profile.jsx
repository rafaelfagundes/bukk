import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Card, Icon } from "semantic-ui-react";
import moment from "moment";
import calendarLocale from "./CalendarLocale";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
moment.locale("pt-br", calendarLocale);

const mapRole = role => {
  switch (role) {
    case "owner":
      return "Administrador";
    case "manager":
      return "Gerente";
    case "supervisor":
      return "Supervisor";
    default:
      break;
  }
};

class Profile extends Component {
  render() {
    return (
      <>
        <DashboardHeader
          icon="user circle"
          title="Perfil"
          subtitle="Informações sobre seu usuário"
        />
        <Card>
          <Image src={this.props.user.avatar} />
          <Card.Content>
            <Card.Header>
              {this.props.user.firstName + " " + this.props.user.lastName}
            </Card.Header>
            <Card.Meta>
              <span className="date">
                {"Entrou em " +
                  moment(this.props.user.createdAt).format("MMMM [de] YYYY")}
              </span>
            </Card.Meta>
            <Card.Description>{mapRole(this.props.user.role)}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a href="/change-picture">
              <Icon name="photo" />
              Alterar imagem
            </a>
          </Card.Content>
        </Card>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.dashboard.user
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
