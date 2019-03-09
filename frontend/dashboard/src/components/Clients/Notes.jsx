import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input, Button, Confirm } from "semantic-ui-react";

/* ===============================================================================
  Components
=============================================================================== */

const NoteItem = props => (
  <div {...props} className={props.className}>
    <div>{props.title}</div>
    <div>{props.text.replace(/<(?:.|\n)*?>/gm, "")}</div>
  </div>
);

/* ============================================================================ */

/* ===============================================================================
  STYLED COMPONENTS
=============================================================================== */

const Columns = styled.div`
  display: flex;
  flex-direction: row;
`;

const Editor = styled(ReactQuill)`
  width: 100%;
  font-family: "Lato";
  height: calc(70vh - 93px);
  > .ql-toolbar {
    background-color: #fdfdfd;
  }

  > .ql-container {
    border-bottom-right-radius: 4px;
    font-size: 11pt;
    font-family: "Lato";
  }
`;

const NotesMenu = styled.div`
  border: 1px solid #ccc;
  width: 200px;
  border-bottom-left-radius: 4px;
  border-right: none;
  position: relative;
  border-top-left-radius: 4px;
  height: 70vh;
  box-sizing: border-box;
`;

const NotesSearch = styled.div`
  background-color: #fafafa;
  border-bottom: 1px solid #ccc;
  height: 51px;
  padding: 5px 8px;
`;

const SearchInput = styled(Input)`
  /* > input {
    font-size: 14px !important;
    padding: 5px 5px 5px 10px !important;
  } */
`;

const NotesList = styled.div`
  overflow: auto;
  height: calc(70vh - 88px);
`;

const StyledNoteItem = styled(NoteItem)`
  background-color: ${props => (props.selected ? "#2185d0" : "none")};
  padding: 5px 10px;
  height: 52px;
  cursor: pointer;

  border-bottom: 1px solid #ccc;

  > div:first-child {
    color: #666;
    color: ${props => (props.selected ? "white" : "#666")};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 145px;
  }
  > div:last-child {
    color: ${props => (props.selected ? "white" : "#888")};
    opacity: 0.8;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 145px;
  }
`;

const NewNoteButton = styled(Button)`
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 0px !important;
`;

const EditorHolder = styled.div`
  width: 100%;
`;

const NoteTitle = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-bottom: none;
  padding: 5px;
  border-top-right-radius: 4px;

  > .input {
    margin-right: 10px;
    width: 100%;
  }
`;

const NoteTitleLabel = styled.div`
  line-height: 40px;
  margin: 0 10px;
  font-size: 1rem;
`;

const SaveButton = styled(Button)`
  width: 40px;
`;
const DeleteButton = styled(Button)`
  width: 40px;
`;

/* ============================================================================ */

export class Notes extends Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
    this.state = {
      text: "",
      title: "",
      selectedIndex: 0,
      modified: -1,
      confirmSave: false,
      notes: [
        {
          title: "Nova Nota",
          text:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam nostrum amet ipsum possimus, debitis et unde at deleniti corporis accusamus nam doloremque cumque reprehenderit rem quaerat, est consequuntur, cum beatae."
        },
        {
          title: "Lista de Supermercado",
          text:
            "Quibusdam nostrum amet ipsum possimus, debitis et unde at deleniti corporis accusamus nam doloremque cumque reprehenderit rem quaerat, est consequuntur, cum beatae."
        }
      ]
    };

    // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    let _notes = JSON.parse(JSON.stringify(this.state.notes));
    if (_notes.length > 0) {
      const _index = this.state.selectedIndex;
      _notes[_index].text = value;
      this.setState({
        text: value,
        notes: _notes,
        modified: this.state.modified + 1
      });
    }
  }

  handleTitleChange = e => {
    const _value = e.currentTarget.value;

    let _notes = JSON.parse(JSON.stringify(this.state.notes));
    const _index = this.state.selectedIndex;
    _notes[_index].title = _value;
    this.setState({
      title: _value,
      notes: _notes,
      modified: this.state.modified + 1
    });
  };

  componentDidMount() {
    this.setState({
      title: this.state.notes[0].title,
      text: this.state.notes[0].text,
      selectedIndex: 0
    });
  }

  selectNote = index => {
    if (this.state.modified > 1) {
      this.setState({ confirmSave: true });
    }

    this.setState({
      selectedIndex: index,
      title: this.state.notes[index].title,
      text: this.state.notes[index].text,
      modified: -1
    });
  };

  newNote = () => {
    let _notes = JSON.parse(JSON.stringify(this.state.notes));

    _notes.unshift({ title: "Nova Nota", text: "" });

    const _index = 0;

    this.setState({
      notes: _notes,
      selectedIndex: _index,
      title: _notes[_index].title,
      text: _notes[_index].text,
      modified: -1
    });

    this.editor.current.focus();
  };

  deleteNote = () => {
    let _notes = JSON.parse(JSON.stringify(this.state.notes));
    _notes.shift();
    let _newIndex = 0;

    if (_notes.length === 0) {
      this.setState({
        notes: _notes,
        selectedIndex: _newIndex,
        title: "",
        text: ""
      });
    } else {
      this.setState({
        notes: _notes,
        selectedIndex: _newIndex,
        title: this.state.notes[_newIndex].title,
        text: this.state.notes[_newIndex].text
      });
    }
  };

  closeSaveConfirm = () => {
    this.setState({ confirmSave: false });
  };

  saveNote = () => {
    console.log("salvar nota");
    this.setState({ confirmSave: false, modified: 0 });
  };

  render() {
    return (
      <Columns>
        <Confirm
          open={this.state.confirmSave}
          cancelButton="Não Salvar"
          confirmButton="Salvar"
          header="Salvar nota"
          content="Deseja salvar a nota?"
          onCancel={this.closeSaveConfirm}
          onConfirm={this.saveNote}
        />
        <NotesMenu>
          <NotesSearch>
            <SearchInput icon="search" placeholder="Procurar..." fluid />
          </NotesSearch>
          {this.state.notes && (
            <NotesList>
              {this.state.notes.map((note, index) => (
                <StyledNoteItem
                  key={index}
                  title={note.title}
                  text={note.text}
                  selected={index === this.state.selectedIndex}
                  onClick={() => this.selectNote(index)}
                />
              ))}
            </NotesList>
          )}
          <NewNoteButton
            content="Nova Nota"
            icon="file"
            onClick={this.newNote}
          />
        </NotesMenu>
        <EditorHolder>
          <NoteTitle>
            <NoteTitleLabel>Título</NoteTitleLabel>
            <Input value={this.state.title} onChange={this.handleTitleChange} />
            <Button.Group>
              <SaveButton
                icon="save"
                compact
                color="green"
                disabled={this.state.modified <= 0}
                onClick={this.saveNote}
              />
              <DeleteButton
                icon="delete"
                compact
                color="red"
                onClick={this.deleteNote}
              />
            </Button.Group>
          </NoteTitle>
          <Editor
            value={this.state.text}
            onChange={this.handleChange}
            ref={this.editor}
          />
        </EditorHolder>
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
