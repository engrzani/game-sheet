// src/components/Header.jsx
import styled from 'styled-components';
import { Input } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';

export default function Header({ state, updateState, currentCharacter }) {
  const { theme } = useTheme();
  
  return (
    <HeaderContainer theme={theme}>
      <LogoContainer theme={theme}>
        <LogoPlaceholder theme={theme}>🎲</LogoPlaceholder>
        {currentCharacter && (
          <CharacterLabel theme={theme}>
            Character: {currentCharacter}
          </CharacterLabel>
        )}
      </LogoContainer>
      <Input
        theme={theme}
        placeholder="Player Name"
        value={state.playerName}
        onChange={e => updateState('playerName', e.target.value)}
      />
      <Input
        theme={theme}
        placeholder="Character Name"
        value={state.characterName}
        onChange={e => updateState('characterName', e.target.value)}
      />
      <Input
        theme={theme}
        placeholder="Species"
        value={state.species}
        onChange={e => updateState('species', e.target.value)}
      />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 1fr 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: ${props => props.theme.sectionBg};
  border-radius: 8px;
  border: 2px solid ${props => props.theme.borderAccent};
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 8px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CharacterLabel = styled.div`
  font-size: 10px;
  color: ${props => props.theme.borderAccent};
  font-weight: bold;
  margin-top: 4px;
  text-align: center;
`;

const LogoPlaceholder = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: ${props => props.theme.button};
  border-radius: 50%;
  border: 3px solid ${props => props.theme.borderAccent};
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05) rotate(10deg);
  }
`;