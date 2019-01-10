import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, Card, Icon } from "semantic-ui-react";
import moment from "moment";
import calendarLocale from "./CalendarLocale";
moment.locale("pt-br", calendarLocale);

const mapRole = role => {
  switch (role) {
    case "owner":
      return "Proprietário";
    default:
      break;
  }
};

class Profile extends Component {
  render() {
    return (
      <>
        <Card>
          <Image src="https://res.cloudinary.com/bukkapp/image/upload/v1547090194/Bukk/Assets/User/007-avatar-6.png" />
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
