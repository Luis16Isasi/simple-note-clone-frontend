import * as React from 'react';

type NoteState = {
  note: Note;
  selectNote(note: Note): void;
  listNotes: Note[];
  setListNotes(note: Note[]): void;
  addNote(note: Note): void;
};

type Note = {
  id: string;
  text: string;
  user: User;
};

type User = {
  id: string;
  email: string;
};

const NoteContext = React.createContext<NoteState | undefined>(undefined);

export const NoteContextProvider = ({ children }) => {
  const [note, setNote] = React.useState(undefined);
  const [listNotes, setListNotes] = React.useState(undefined);

  console.log({ note });

  const selectNote = (note: Note) => {
    setNote(note);
  };

  // const updateListNote = () => {
  //   if (data && !error) {
  //     setListNotes(data.notes);
  //   }
  // };

  const addNote = (note: Note) => {
    setListNotes([note, ...listNotes]);
  };

  return (
    <NoteContext.Provider
      value={{
        note,
        selectNote,
        listNotes,
        setListNotes,
        addNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNoteContext = () => {
  const noteData = React.useContext(NoteContext);

  if (noteData === undefined) {
    throw new Error('useNoteContext must be within the NoteContextProvide.');
  }

  return noteData;
};