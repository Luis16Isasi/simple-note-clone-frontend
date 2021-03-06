import * as React from 'react';

import styled from 'styled-components';

import { Switch, Input, Label } from './SwitchStyled';

const Markdown = ({
  selectedNote,
  updateNote,
  selectNote,
  selectedNote: { id, text, isMarkdown },
}) => {
  const handledInputCheck = (e) => {
    const checked = e.target.checked;

    if (checked) {
      selectNote({ ...selectedNote, isMarkdown: true });
      updateNote({
        variables: { id, text, isMarkdown: true },
      });
    } else {
      selectNote({ ...selectedNote, isMarkdown: false });
      updateNote({
        variables: { id, text, isMarkdown: false },
      });
    }
  };

  return (
    <Div>
      <Text>
        <span>Markdown</span>
        <p>
          Enable markdown formatting on this note.{' '}
          <a
            href="https://simplenote.com/help/#markdown"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#3361cc' }}
          >
            Learn more...
          </a>
        </p>
      </Text>
      <Switch>
        <Input
          id="checkMarkdown"
          onChange={handledInputCheck}
          checked={isMarkdown}
        />
        <Label htmlFor="checkMarkdown" />
      </Switch>
    </Div>
  );
};

//------------styled-----------
const Div = styled.div`
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  height: 104px;
  border-bottom: 1px solid ${(props) => props.theme.colorBorder};
  display: flex;
  align-items: center;

  * {
    font-family: inherit;
    line-height: 20px;
    font-size: 13px;
    font-weight: 300 !important;
    color: #646970;
  }
`;

const Text = styled.div`
  > span {
    font-weight: 400 !important;
    color: ${(props) => props.theme.colorText};
  }
`;
export default Markdown;
