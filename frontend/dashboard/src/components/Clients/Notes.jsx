import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input } from "semantic-ui-react";

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const Columns = styled.div`
  display: flex;
  flex-direction: row;
`;

const Editor = styled(ReactQuill)`
  width: 100%;
  height: 70vh;
  font-family: "Lato";
  > .ql-toolbar {
    background-color: #fafafa;
    border-top-right-radius: 4px;
  }

  > .ql-container {
    border-bottom-right-radius: 4px;
    height: calc(70vh - 42px);
    font-size: 11pt;
    font-family: "Lato";
  }
`;

const NotesMenu = styled.div`
  border: 1px solid #ccc;
  border-top-left-radius: 4px;
  width: 200px;
  border-bottom-left-radius: 4px;
  border-right: none;
`;

const NotesSearch = styled.div`
  background-color: #fafafa;
  border-bottom: 1px solid #ccc;
  height: 41px;
  padding: 5px 8px;
`;

const SearchInput = styled(Input)`
  > input {
    font-size: 14px !important;
    padding: 5px 5px 5px 10px !important;
  }
`;

/* ============================================================================ */

export class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "" }; // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  render() {
    return (
      <Columns>
        <NotesMenu>
          <NotesSearch>
            <SearchInput
              icon="search"
              placeholder="Procurar..."
              fluid
              size="mini"
            />
          </NotesSearch>
        </NotesMenu>
        <Editor value={this.state.text} onChange={this.handleChange} />
      </Columns>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes);
