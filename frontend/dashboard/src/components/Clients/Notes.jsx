import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import moment from "moment";
import _ from "lodash";
import shortid from "shortid";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input, Button, Confirm, Icon } from "semantic-ui-react";
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

  width: 18vw;
  > div:first-child {
    color: #666;
    color: ${props => (props.selected ? "white" : "#666")};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  > div:last-child {
    color: ${props => (props.selected ? "white" : "#888")};
    opacity: 0.8;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

const NoResults = styled.div`
  padding: 5px 10px;
  height: 72px;
  line-height: 62px;
  text-align: center;
  opacity: 0.6;
  width: 18vw;
  display: flex;
  flex-direction: column;
`;

/* ============================================================================ */

export class Notes extends Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
    this.state = {
      text: "",
      title: "",
      selectedId: undefined,
      modified: -1,
      confirmSave: false,
      notes: [],
      noResults: false
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
      let _index = _.findIndex(_notes, o => {
        return o.id === this.state.selectedId;
      });
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

      let _index = _.findIndex(_notes, o => {
        return o.id === this.state.selectedId;
      });

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
          response.data.notes.forEach(note => {
            note["show"] = true;
            note["id"] = note._id;
          });

          this.setState({
            notes: response.data.notes,
            selectedId: response.data.notes[0].id,
            title: response.data.notes[0].title,
            text: response.data.notes[0].text
          });

          console.log("Notas carregadas");
        }
      })
      .catch(error => {
        console.log(error.response.data.msg);
      });
  };

  componentDidMount() {
    this.loadNotes();
  }

  selectNote = id => {
    if (this.state.modified > 1) {
      this.setState({ confirmSave: true });
    }

    const result = _.find(this.state.notes, function(o) {
      return o.id === id;
    });

    this.setState({
      selectedId: result.id,
      title: result.title,
      text: result.text,
      modified: -1
    });
  };

  newNote = () => {
    let _notes = [];
    if (this.state.notes.length) {
      _notes = JSON.parse(JSON.stringify(this.state.notes));
    }

    const newId = shortid.generate();

    _notes.unshift({ title: "Nova Nota", text: "", id: newId, show: true });

    this.setState({
      notes: _notes,
      selectedId: newId,
      title: _notes[0].title,
      text: _notes[0].text,
      modified: -1
    });

    this.editor.current.focus();
  };

  deleteNote = id => {
    let _notes = JSON.parse(JSON.stringify(this.state.notes));

    let _index = _.findIndex(_notes, function(o) {
      return o.id === id;
    });

    _index = _index - 1;

    if (_index < 0) {
      _index = 0;
    }

    _.remove(_notes, function(o) {
      return o.id === id;
    });

    this.setState(
      {
        notes: _notes
      },
      () => {
        if (this.state.notes.length > 0) {
          this.selectNote(this.state.notes[_index].id);
        } else {
          this.setState({ title: "", text: "" });
        }
        this.saveNote();
      }
    );
  };

  closeSaveConfirm = () => {
    this.setState({ confirmSave: false });
  };

  saveNote = () => {
    this.setState({ confirmSave: false, modified: 0 });

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
        this.loadNotes();
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };

  search = e => {
    const _matchedNotes = JSON.parse(JSON.stringify(this.state.notes));
    let _searchInput = String(e.currentTarget.value);
    _searchInput = _searchInput.toLowerCase();

    if (_searchInput !== "") {
      _matchedNotes.forEach(note => {
        if (note.title.toLowerCase().indexOf(_searchInput) >= 0) {
          note.show = true;
        } else if (
          note.text
            .replace(/<(?:.|\n)*?>/gm, "")
            .toLowerCase()
            .indexOf(_searchInput) >= 0
        ) {
          note.show = true;
        } else {
          note.show = false;
        }
      });
    } else {
      _matchedNotes.forEach(note => {
        note.show = true;
      });
    }
    this.setState({ notes: _matchedNotes, noResults: false }, () => {
      let _id = undefined;
      this.state.notes.forEach(note => {
        if (note.show) {
          if (_id === undefined) {
            _id = note.id;
          }
        }
      });
      if (_id !== undefined) {
        this.selectNote(_id);
      } else {
        this.setState({ noResults: true });
      }
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
            <SearchInput
              icon="search"
              placeholder="Procurar..."
              fluid
              onChange={this.search}
            />
          </NotesSearch>
          {this.state.notes && (
            <NotesList>
              {this.state.notes.map((note, index) => (
                <React.Fragment key={index}>
                  {note.show && (
                    <StyledNoteItem
                      title={note.title}
                      text={note.text}
                      selected={note.id === this.state.selectedId}
                      onClick={() => this.selectNote(note.id)}
                    />
                  )}
                </React.Fragment>
              ))}
              {this.state.noResults && (
                <NoResults>
                  <span>
                    <Icon name="search" />
                    Sem resultados
                  </span>
                </NoResults>
              )}
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
                onClick={() => this.deleteNote(this.state.selectedId)}
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
