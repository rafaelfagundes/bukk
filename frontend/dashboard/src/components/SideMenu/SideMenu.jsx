import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./SideMenu.css";

class SideMenu extends Component {
  state = { activeItem: "dashboard" };

  handleItemClick = e => {
    this.setState({ activeItem: e.currentTarget.id });
    // console.log(e.currentTarget.id);
  };

  render() {
    const { activeItem } = this.state;
    return (
      <Menu
        className="SideMenu"
        style={{
          backgroundColor: this.props.company
            ? this.props.company.settings.colors.primaryBack
            : "#888"
        }}
        id="side-menu"
        vertical
        inverted
      >
        <div className="menu-logo">
          <img
            src={this.props.company ? this.props.company.logo : ""}
            alt="Logo"
          />
        </div>
        <Link
          id="dashboard"
          to="/dashboard"
          className={activeItem === "dashboard" ? "active item" : "item"}
          onClick={this.handleItemClick}
        >
          <Icon name="dashboard" />
          Dashboard
        </Link>
        <Link
          to="/dashboard/agendamentos"
          className={activeItem === "agendamentos" ? "active item" : "item"}
          onClick={this.handleItemClick}
          id="agendamentos"
        >
          <Icon name="calendar outline" />
          Agendamentos
        </Link>
      </Menu>
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
)(SideMenu);
