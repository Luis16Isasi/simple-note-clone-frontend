import * as React from 'react';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { colorIcon } from 'StylesApp';
import { Button, Div } from './Styled';

const Trash = ({ trash, setTrash, setAllNotes }) => {
  const onClick = () => {
    setAllNotes(false);
    setTrash(true);
  };
  return (
    <Button select={trash} onClick={onClick}>
      <Div select={trash}>
        <DeleteForeverIcon style={{ color: `${colorIcon}` }} />
        Trash
      </Div>
    </Button>
  );
};

export default Trash;