import React, { Component } from "react";
import { connect } from "react-redux";
import config from "../../config";
import Axios from "axios";
export class Client extends Component {
  state = {
    client: undefined
  };

  componentDidMount() {
    console.log();

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
        this.setState({ client: response.data });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }

  render() {
    return (
      <div>
        <h1>Criente</h1>
        <pre>{JSON.stringify(this.state.client, null, 2)}</pre>
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
