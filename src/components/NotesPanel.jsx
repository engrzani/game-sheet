import styled from 'styled-components';
import { Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';

export default function NotesPanel({ state, updateState }) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const notes = state.notes || '';

  const handleSave = (e) => {
    updateState('notes', e.target.value);
  };

  return (
    <>
      <ToggleButton theme={theme} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '📝 Close Notes' : '📝 Open Notes/Progression'}
      </ToggleButton>
      
      {isOpen && (
        <NotesOverlay onClick={() => setIsOpen(false)}>
          <NotesModal theme={theme} onClick={(e) => e.stopPropagation()}>
            <NotesHeader theme={theme}>
              <h3>Character Notes & Progression</h3>
              <CloseButton theme={theme} onClick={() => setIsOpen(false)}>
                ×
              </CloseButton>
            </NotesHeader>
            
            <NotesContent theme={theme}>
              <NotesTextarea
                theme={theme}
                value={notes}
                onChange={handleSave}
                placeholder="Track items purchased, EXP growth, techniques learned, story notes, etc..."
              />
            </NotesContent>
            
            <NotesFooter theme={theme}>
              <SaveNote>Changes are saved automatically</SaveNote>
            </NotesFooter>
          </NotesModal>
        </NotesOverlay>
      )}
    </>
  );
}

const ToggleButton = styled.button`
  width: 100%;
  background: ${props => props.theme.borderAccent};
  color: #000;
  border: none;
  padding: 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
  margin: 16px 0;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.01);
  }
`;

const NotesOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const NotesModal = styled.div`
  background: ${props => props.theme.sectionBg};
  border: 3px solid ${props => props.theme.borderAccent};
  border-radius: 10px;
  width: 100%;
  max-width: 700px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

const NotesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 2px solid ${props => props.theme.border};
  
  h3 {
    margin: 0;
    color: ${props => props.theme.text};
    font-size: 18px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.borderAccent};
  }
`;

const NotesContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 400px;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 14px;
  font-size: 15px;
  font-family: 'Cinzel', serif;
  line-height: 1.6;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.borderAccent};
    box-shadow: 0 0 0 2px ${props => props.theme.borderAccent}33;
  }
  
  &::placeholder {
    color: ${props => props.theme.textMuted};
    opacity: 0.6;
  }
`;

const NotesFooter = styled.div`
  padding: 12px 20px;
  border-top: 2px solid ${props => props.theme.border};
  text-align: center;
`;

const SaveNote = styled.div`
  font-size: 13px;
  color: ${props => props.theme.textMuted};
  font-style: italic;
`;
