import * as React from 'react';

import styled from 'styled-components';
import debounce from 'lodash/debounce';
import { useQuery } from '@apollo/client';

import { useAppContext } from 'ContextApp/AppContext';
import GET_NOTES from 'GraphqlApp/GetNotes.graphql';
import Header from './components/Header';
import Search from './components/Header/components/Search';
import ListNotes from './components/ListNotes';
import { IconAnimation, Error } from 'StylesApp';

const Sidebar = ({ setEditNote, switchPinned, setSwitchPinned, textNote }) => {
  const {
    note,
    selectNote,
    trash,
    allNotes,
    searchTag: { id: _tagId, name: _tagName },
  } = useAppContext();

  const [searchGraphqlVariable, setSearchGV] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [addingNewNote, setAddingNewNote] = React.useState(false);
  const [filterNotes, setFilterNotes] = React.useState({
    listNotes: undefined,
    lengthPinned: undefined,
  });

  const { loading, error, data } = useQuery(GET_NOTES, {
    variables: { text: searchGraphqlVariable, isInTrash: trash, tagId: _tagId },
  });

  React.useEffect(() => {
    //filter Notes
    let notesPinned = [];
    let notesNoPinned = [];

    //FILTRANDO LA DATA
    if (data) {
      data.notes.forEach((note) => {
        //filtramos y los añadimos en diferentes array para luego juntarlos como queremos
        if (note.pinned) notesPinned.push(note);
        else notesNoPinned.push(note);
      });
      setFilterNotes({
        listNotes: [...notesPinned, ...notesNoPinned],
        lengthPinned: notesPinned.length,
      });
    }
  }, [data, searchGraphqlVariable]);

  const onChange = (event) => {
    //extraremos el value
    const {
      target: { value: _value },
    } = event;
    //asignamos el value
    setSearch(_value);
    searchNote(_value);
  };

  const onClickClear = () => {
    setSearch('');
    setSearchGV('');
  };

  const searchNote = React.useCallback(
    debounce((value) => {
      setSearchGV(value);
    }, 300),
    []
  );

  // Condicionales para renderizar ListNotes, lo hacemos para asegurarnos
  // que listNotes no llegue como undefined
  function renderListNotes() {
    if (loading) {
      return <IconAnimation style={{ fontSize: '60px' }} />;
    }
    if (error) {
      return (
        <Error> Hay un Error en nuestro servidor, intentalo mas tarde </Error>
      );
    }

    if (filterNotes.listNotes) {
      return (
        <ListNotes
          filterNotes={filterNotes}
          note={note}
          selectNote={selectNote}
          searchGraphqlVariable={searchGraphqlVariable}
          onClickClear={onClickClear}
          trash={trash}
          allNotes={allNotes}
          setEditNote={setEditNote}
          switchPinned={switchPinned}
          setSwitchPinned={setSwitchPinned}
          textNote={textNote}
          addingNewNote={addingNewNote}
          setAddingNewNote={setAddingNewNote}
        />
      );
    }

    return null;
  }

  return (
    <Div>
      <Header
        allNotes={allNotes}
        trash={trash}
        tagName={_tagName}
        setAddingNewNote={setAddingNewNote}
      />
      <Search
        search={search}
        onChange={onChange}
        onClickClear={onClickClear}
        allNotes={allNotes}
        trash={trash}
      />
      {renderListNotes()}
    </Div>
  );
};

//------------STYLED-------------
const Div = styled.div`
  background-color: ${(props) => props.theme.backgroundColor} !important;
  display: flex;
  flex-flow: column;
  min-height: 100vh;
  transition: all 0.25s;

  //DESKTOP
  @media only screen and (min-width: 990px) {
    flex-basis: 328px;
    max-width: 328px;
    border-right: 1px solid ${(props) => props.theme.colorBorder};
  }

  //TABLET
  @media only screen and (max-width: 989px) and (min-width: 768px) {
    flex-basis: 280px;
    max-width: 280px;
    border-right: 1px solid ${(props) => props.theme.colorBorder};
  }

  //MOVIL
  @media only screen and (max-width: 767px) {
    width: 100%;
    max-width: 100%;
  }
`;

export default React.memo(Sidebar);
