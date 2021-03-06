import * as React from 'react';

import styled, { keyframes } from 'styled-components';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import { Shortcuts } from 'shortcuts';
import { useMediaQuery } from 'react-responsive';

import { USER_SESSION_KEY } from 'Constants';
import UPDATE_NOTE from 'GraphqlApp/UpdateNote.graphql';
import Main from './components/Main';
import Info from './components/Info';
import Sidebar from './components/Sidebar';
import EditNote from './components/EditNote';
import { useAppContext } from 'ContextApp/AppContext';
import { useUserSettings } from 'Context/SettingsContext';

import { MainActive, MainNoActive, InfoActive, InfoNoActive } from 'StylesApp';
import ShortcutsModal from './Modals/ShortcutsModal';

const Application = () => {
  const {
    isOpenMain,
    isOpenInfo,
    isOpenSidebar,
    isOpenModalShortcuts,
    setIsOpenModalShortcuts,
    isAllNotes,
    selectedNote,
    isTrash,
  } = useAppContext();

  const [editNote, setEditNote] = React.useState(false);
  const [switchPinned, setSwitchPinned] = React.useState(false);
  const [showMarkdown, setShowMakdown] = React.useState(false);

  const [updateNote, { loading: loadingUpdateTextNote }] = useMutation(
    UPDATE_NOTE
  );

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 767px)',
  });

  const history = useHistory();
  const {
    settings: { theme },
  } = useUserSettings();

  React.useEffect(() => {
    const token = localStorage.getItem(USER_SESSION_KEY);
    if (!token) {
      history.push('/login');
      return;
    }
  }, []);

  React.useEffect(() => {
    const shortcuts = new Shortcuts();
    if (isDesktopOrLaptop) {
      shortcuts.add({
        shortcut: 'Ctrl+Shift+O',
        handler: (e) => {
          e.preventDefault();
          setIsOpenModalShortcuts(!isOpenModalShortcuts);
        },
      });
    }
    return () => {
      if (isDesktopOrLaptop) {
        shortcuts.remove({ shortcut: 'Ctrl+Shift+O' });
      }
    };
  }, [isOpenModalShortcuts]);

  if (theme !== undefined) {
    return (
      <>
        <App>
          {isOpenMain && <Main className="mainActive" id="main" />}
          <Div
            className={isOpenMain ? 'showMain' : isOpenInfo && 'showInfo'}
            id="Application"
          >
            <Sidebar
              isOpenSidebar={isOpenSidebar}
              editNote={editNote}
              setEditNote={setEditNote}
              switchPinned={switchPinned}
              setSwitchPinned={setSwitchPinned}
              loadingUpdateTextNote={loadingUpdateTextNote}
            />
            <EditNote
              showMarkdown={showMarkdown}
              setShowMakdown={setShowMakdown}
              selectedNote={selectedNote}
              isTrash={isTrash}
              isAllNotes={isAllNotes}
              setEditNote={setEditNote}
              editNote={editNote}
              updateNote={updateNote}
            />
          </Div>
          {isOpenInfo && (
            <Info
              className="infoActive"
              id="info"
              setSwitchPinned={setSwitchPinned}
            />
          )}
        </App>
        {isOpenModalShortcuts && (
          <ShortcutsModal setIsOpenModalShortcuts={setIsOpenModalShortcuts} />
        )}
      </>
    );
  }

  return null;
};

//---------------STYLED------------
const App = styled.div`
  display: flex;
  flex-flow: row;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  .showMain {
    > * {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  .showInfo {
    position: relative;
    animation: ${InfoActive} 0.2s linear;
    right: 320px;

    * {
      opacity: 0.8;
      pointer-events: none;
    }
  }

  .hideInfo {
    animation: ${InfoNoActive} 0.2s linear;
    right: 0px;

    * {
      opacity: 0.8;
      pointer-events: none;
    }
  }

  .mainActive {
    animation: ${MainActive} 0.2s linear;
    margin-left: 0px;
  }

  .hidingMain {
    animation: ${MainNoActive} 0.2s linear;
    margin-left: -260px;
  }

  .infoActive {
    animation: ${InfoActive} 0.2s linear;
    right: 320px;
  }

  .hidingInfo {
    animation: ${InfoNoActive} 0.2s linear;
    right: 0px;
  }

  * {
    //THEME
    background-color: ${(props) => props.theme.backgroundColor};
  }
`;

const ShowNote = keyframes`
  0% {  right: 0px; }
  100% { right: 100%; }

`;

const Div = styled.div`
  display: flex;
  flex-flow: row;
  height: 100%;
  width: 100%;
  min-width: 100%;
  max-width: 100%;

  .showNote {
    position: relative;
    animation: ${ShowNote} 0.2 linear;
    right: 100%;
  }

  .sidebarNoActive {
    margin-left: -328px;
  }
`;

export default Application;
