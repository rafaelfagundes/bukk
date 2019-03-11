import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import moment from "moment";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input, Button, Confirm } from "semantic-ui-react";
import Axios from "axios";
import config from "../../config";

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
  width: 20vw;
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
    width: 18vw;
  }
  > div:last-child {
    color: ${props => (props.selected ? "white" : "#888")};
    opacity: 0.8;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 18vw;
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
      notes: []
    };

    // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
  }

  removeLast = () => {
    const _remover =
      this.state.title === "" &&
      this.state.text.replace(/<(?:.|\n)*?>/gm, "") === "";

    if (this.state.notes.length === 1) {
      if (_remover) {
        this.setState({ notes: [], title: "", text: "" });
      }
    }
  };

  handleChange(value) {
    let _notes = JSON.parse(JSON.stringify(this.state.notes));
    if (!_notes.length) {
      if (this.state.title === this.state.text && this.state.modified > 0) {
        return false;
      }
    }
    if (_notes.length > 0) {
      const _index = this.state.selectedIndex;
      _notes[_index].text = value;
      _notes[_index].updatedAt = moment().toDate();
      this.setState(
        {
          text: value,
          notes: _notes,
          modified: this.state.modified + 1
        },
        () => {
          this.removeLast();
        }
      );
    } else {
      const _notes = [{ title: "", text: value }];
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
    if (_notes.length > 0) {
      let _notes = JSON.parse(JSON.stringify(this.state.notes));
      const _index = this.state.selectedIndex;
      _notes[_index].title = _value;
      _notes[_index].updatedAt = moment().toDate();
      this.setState(
        {
          title: _value,
          notes: _notes,
          modified: this.state.modified + 1
        },
        () => {
          this.removeLast();
        }
      );
    } else {
      const _notes = [{ title: _value, text: "" }];
      this.setState({
        title: _value,
        notes: _notes,
        modified: this.state.modified + 1
      });
    }
  };

  loadNotes = () => {
    const token = localStorage.getItem("token");

    let requestConfig = {
      headers: {
        Authorization: token
      }
    };

    const _clientId = this.props.match.params.id;

    Axios.post(
      config.api + "/costumers/notes/get",
      { id: _clientId },
      requestConfig
    )
      .then(response => {
        if (response.data.notes) {
          this.setState({
            notes: response.data.notes,
            selectedIndex: 0,
            title: response.data.notes[0].title,
            text: response.data.notes[0].text
          });
        }
      })
      .catch(error => {
        console.log(error.response.data.msg);
      });
  };

  componentDidMount() {
    this.loadNotes();
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
    let _notes = [];
    if (this.state.notes.length) {
      _notes = JSON.parse(JSON.stringify(this.state.notes));
    }

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

  deleteNote = index => {
    let _notes = JSON.parse(JSON.stringify(this.state.notes));
    _notes.splice(index, 1);
    let _newIndex = index - 1 < 0 ? 0 : index - 1;
    let _title = "";
    let _text = "";

    if (_newIndex) {
      _title = this.state.notes[_newIndex].title;
      _text = this.state.notes[_newIndex].text;
    } else {
      _title = "";
      _text = "";
    }

    this.setState({
      notes: _notes,
      selectedIndex: _newIndex,
      title: _title,
      text: _text
    });
  };

  closeSaveConfirm = () => {
    this.setState({ confirmSave: false });
  };

  saveNote = () => {
    console.log("salvar nota");
    this.setState({ confirmSave: false, modified: 0 });

    console.log("this.state.notes", this.state.notes);

    const token = localStorage.getItem("token");
    let requestConfig = {
      headers: {
        Authorization: token
      }
    };
    const _clientId = this.props.match.params.id;
    Axios.post(
      config.api + "/costumers/notes/save",
      { id: _clientId, notes: this.state.notes },
      requestConfig
    )
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.response.data);
      });
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
            icon="file alternate outline"
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
                disabled={this.state.notes.length === 0}
                onClick={() => this.deleteNote(this.state.selectedIndex)}
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
