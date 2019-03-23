import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

/* 
--- ITEM TEMPLATE ---

menuItem = {
  id: 'geral',
  icon: 'user',
  text: 'Geral'
  link: '/dashboard/clientes'
}
*/

const StyledMenu = styled(Menu)`
  margin-bottom: 30px !important;

  > a .item {
    color: ${props => props.colors.primaryText} !important;
  }

  > a .active {
    background-color: ${props => props.colors.secondaryBack} !important;
    color: ${props => props.colors.secondaryText} !important;
  }

  > .item {
    color: ${props => props.colors.primaryText} !important;
  }

  > .active {
    background-color: ${props => props.colors.secondaryBack} !important;
    color: ${props => props.colors.secondaryText} !important;
  }

  background-color: ${props => props.colors.primaryBack} !important;
`;

class ComponentTopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem ? this.props.activeItem : undefined,
      items: this.props.items
    };
  }

  handleItemClick = name => {
    this.setState({ activeItem: name });
    return name;
  };

  render() {
    const { activeItem } = this.state;
    return (
      <>
        {this.props.company && (
          <StyledMenu borderless colors={this.props.company.settings.colors}>
            {!this.props.link &&
              this.state.items.map(item => (
                <Menu.Item
                  key={item.id}
                  name={item.id}
                  content={item.text}
                  icon={item.icon}
                  active={activeItem === item.id}
                  onClick={e => {
                    this.handleItemClick(item.id);
                    this.props.onClick(item.id);
                  }}
                />
              ))}
            {this.props.link &&
              this.state.items.map(item => (
                <Link to={item.link} key={item.id}>
                  <Menu.Item
                    as="span"
                    name={item.id}
                    content={item.text}
                    icon={item.icon}
                    active={activeItem === item.id}
                    onClick={e => {
                      this.handleItemClick(item.id);
                      this.props.onClick(item.id);
                    }}
                  />
                </Link>
              ))}
          </StyledMenu>
        )}
      </>
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
)(ComponentTopMenu);
