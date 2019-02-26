import React, { Component } from "react";
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
  margin-bottom: 40px !important;
  /* background-color: #490e49 !important;
  > a {
    color: white !important;
  } */
`;

export default class ComponentTopMenu extends Component {
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
        <StyledMenu borderless>
          {!this.props.link &&
            this.state.items.map(item => (
              <Menu.Item
                key={item.id}
                id={item.id}
                content={item.text}
                icon={item.icon}
                active={activeItem}
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
      </>
    );
  }
}
