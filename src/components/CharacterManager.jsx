// src/components/CharacterManager.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Btn, BtnSmall } from './SharedStyles';

export default function CharacterManager({ 
  characters, 
  currentCharacter, 
  onCharacterChange, 
  onCharacterCreate, 
  onCharacterDelete,
  onClose 
}) {
  const [newCharacterName, setNewCharacterName] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  const handleCreateCharacter = () => {
    if (newCharacterName.trim()) {
      onCharacterCreate(newCharacterName.trim());
      setNewCharacterName('');
      setShowNewForm(false);
    }
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <CharacterPanel>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h4>Characters</h4>
        
        <CharacterList>
          {characters.map(char => (
            <CharacterItem key={char} $active={char === currentCharacter}>
              <CharacterButton 
                onClick={() => onCharacterChange(char)}
                $active={char === currentCharacter}
              >
                {char}
              </CharacterButton>
              {characters.length > 1 && (
                <DeleteButton 
                  onClick={() => onCharacterDelete(char)}
                  title="Delete Character"
                >
                  ×
                </DeleteButton>
              )}
            </CharacterItem>
          ))}
        </CharacterList>

        {showNewForm ? (
          <NewCharacterForm>
            <input
              type="text"
              value={newCharacterName}
              onChange={(e) => setNewCharacterName(e.target.value)}
              placeholder="Character name"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateCharacter()}
              autoFocus
            />
            <Btn onClick={handleCreateCharacter}>Create</Btn>
            <Btn onClick={() => setShowNewForm(false)}>Cancel</Btn>
          </NewCharacterForm>
        ) : (
          <Btn onClick={() => setShowNewForm(true)}>+ New Character</Btn>
        )}
      </CharacterPanel>
    </>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-size: 20px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const CharacterPanel = styled.div`
  position: fixed;
  top: 60px;
  right: 12px;
  background: ${props => props.theme.sectionBg};
  color: ${props => props.theme.text};
  padding: 16px;
  border-radius: 8px;
  border: 2px solid ${props => props.theme.borderAccent};
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  z-index: 1000;
  min-width: 200px;
  max-width: 300px;
  
  h4 {
    margin: 0 0 12px 0;
    color: ${props => props.theme.borderAccent};
    font-size: 16px;
    text-align: center;
  }
`;

const CharacterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

const CharacterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CharacterButton = styled.button`
  background: ${props => props.$active ? props.theme.borderAccent : props.theme.button};
  color: ${props => props.$active ? '#fff' : props.theme.buttonText};
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
  text-align: left;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? props.theme.borderAccent : props.theme.buttonHover};
    transform: translateX(2px);
  }
`;

const DeleteButton = styled(BtnSmall)`
  background: #ff4444;
  color: white;
  
  &:hover {
    background: #ff6666;
  }
`;

const NewCharacterForm = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  
  input {
    flex: 1;
    background: ${props => props.theme.inputBg};
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.inputBorder};
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 12px;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.inputFocus};
    }
  }
`;