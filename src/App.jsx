// src/App.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ThemeProvider from './context/ThemeContext';
import { useTheme } from './hooks/useTheme';

import Header from './components/Header';
import Health from './components/Health';
import Defense from './components/Defense';
import Dodge from './components/Dodge';
import Skills from './components/Skills';
import Speed from './components/Speed';
import ActionPoints from './components/ActionPoints';
import Attacks from './components/Attacks';
import NotesPanel from './components/NotesPanel';
import ThemeToggle from './components/ThemeToggle';
import GlobalBackground from './components/GlobalBackground';
import CharacterManager from './components/CharacterManager';

// ---------------------------------------------------------------------
//  INITIAL STATE
// ---------------------------------------------------------------------
const initialState = {
  playerName: '',
  characterName: '',
  species: '',
  health: { base: 0, equip: 0, mods: 0, current: 0, temp: 0 },

  defense: {
    physical: 0,
    nonPhysical: {},
    otherEffects: ''
  },

  dodge: {
    base: 0,
    mods: 0,
    diceCount: 1,
    rollResult: 0,
    lastRolls: []
  },

  skills: {
    list: [
      { name: 'Power',    base: 0, mods: 0, dice: 1, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Reflexes', base: 0, mods: 0, dice: 1, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Guts',     base: 0, mods: 0, dice: 1, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Charm',    base: 0, mods: 0, dice: 1, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Smarts',   base: 0, mods: 0, dice: 1, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Psyche',   base: 0, mods: 0, dice: 1, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Wits',     base: 0, mods: 0, dice: 1, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Timing',   base: 0, mods: 0, dice: 1, dubs: false, rollResult: 0, lastRoll: null }
    ]
  },

  speed: { base: 0, mods: 0 },
  actionPoints: { current: 5, max: 5, baseMax: 5, carriedOver: false },

  attacks: [
    { 
      id: 1, 
      selectedTypes: { light: false, heavy: false, melee: false, ranged: false, ether: false },
      dice: 0,
      base: 0,
      equip: 0,
      mods: 0,
      apCost: 0,
      dubs: false
    }
  ],

  lastRolls: {},
  notes: ''
};

// ---------------------------------------------------------------------
//  APP CONTENT
// ---------------------------------------------------------------------
function AppContent() {
  const { theme } = useTheme();
  const [state, setState] = useState(initialState);
  const [currentCharacter, setCurrentCharacter] = useState('default');
  const [showCharacterManager, setShowCharacterManager] = useState(false);
  const [layoutOrder, setLayoutOrder] = useState(['dodge', 'skills', 'health', 'defense', 'speed', 'actionPoints', 'attacks']);

  useEffect(() => {
    const saved = localStorage.getItem(`gameSheet_${currentCharacter}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const loadedState = data.state || initialState;
        
        // Validate and fix actionPoints data to prevent NaN
        if (loadedState.actionPoints) {
          loadedState.actionPoints = {
            current: Number.isFinite(loadedState.actionPoints.current) ? loadedState.actionPoints.current : 5,
            max: Number.isFinite(loadedState.actionPoints.max) ? loadedState.actionPoints.max : 10,
            baseMax: Number.isFinite(loadedState.actionPoints.baseMax) ? loadedState.actionPoints.baseMax : 10,
            carriedOver: Boolean(loadedState.actionPoints.carriedOver)
          };
        } else {
          loadedState.actionPoints = { current: 5, max: 10, baseMax: 10, carriedOver: false };
        }
        
        // Migration: Add dice field to all skills if not present (for existing characters)
        if (loadedState.skills && loadedState.skills.list) {
          loadedState.skills.list = loadedState.skills.list.map(skill => {
            if (skill.dice === undefined) {
              return { ...skill, dice: 1 };
            }
            return skill;
          });
          
          // Add Timing to skills if not present
          const hasTimingSkill = loadedState.skills.list.some(skill => skill.name === 'Timing');
          if (!hasTimingSkill) {
            loadedState.skills.list.push({ 
              name: 'Timing', 
              base: 0, 
              mods: 0, 
              dice: 1, 
              dubs: false, 
              rollResult: 0, 
              lastRoll: null 
            });
          }
        }
        
        // Migration: Convert old attacks object to new array structure
        if (!loadedState.attacks || !Array.isArray(loadedState.attacks)) {
          loadedState.attacks = [
            { 
              id: 1, 
              selectedTypes: { light: false, heavy: false, melee: false, ranged: false, ether: false },
              dice: 0,
              base: 0,
              equip: 0,
              mods: 0,
              apCost: 0,
              dubs: false
            }
          ];
        } else {
          // Ensure all existing attacks have the required structure and unique IDs
          loadedState.attacks = loadedState.attacks.map((attack, index) => ({
            id: attack.id || (index + 1),
            selectedTypes: attack.selectedTypes || { light: false, heavy: false, melee: false, ranged: false, ether: false },
            dice: attack.dice || 0,
            base: attack.base || 0,
            equip: attack.equip || 0,
            mods: attack.mods || 0,
            apCost: attack.apCost || 0,
            dubs: attack.dubs || false
          }));
        }
        
        setState(loadedState);
        if (data.layoutOrder) {
          setLayoutOrder(data.layoutOrder);
        }
      } catch (error) {
        console.warn('Failed to load saved data, using initial state:', error);
        setState(initialState);
      }
    }
    // Update character list from localStorage
    setCharacterList(getCharacterList());
  }, [currentCharacter]); // layoutOrder intentionally omitted to avoid infinite loop

  useEffect(() => {
    localStorage.setItem(`gameSheet_${currentCharacter}`, JSON.stringify({ state, layoutOrder }));
  }, [state, layoutOrder, currentCharacter]);

  const updateState = (key, value) =>
    setState(prev => ({ ...prev, [key]: value }));

  const rollDice = (sides = 6, count = 1) => {
    const rolls = [];
    let total = 0;
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * sides) + 1;
      rolls.push(r);
      total += r;
    }
    return { total, rolls };
  };

  const performRoll = (key, diceCount = 1, bonus = 0) => {
    const { total } = rollDice(6, diceCount);
    const final = total + bonus;
    updateState('lastRolls', { ...state.lastRolls, [key]: final });
    return final;
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica');
    let y = 15;
    const line = (text) => { doc.text(text, 15, y); y += 8; };
    line(`Player: ${state.playerName}`);
    line(`Character: ${state.characterName} (${state.species})`);
    line(`Health: ${state.health.current} / ${state.health.base + state.health.equip + state.health.mods}`);
    line(`Defense – Physical: ${state.defense.physical}`);
    Object.entries(state.defense.nonPhysical).forEach(([t, v]) => line(`   ${t}: ${v}`));
    line(`Dodge: ${state.dodge.diceCount}d6 + ${state.dodge.base + state.dodge.mods}`);
    line(`Speed: ${state.speed.base + state.speed.mods}`);
    line(`AP: ${state.actionPoints.current}`);
    doc.save('character-sheet.pdf');
  };

  const resetRolls = () => {
    updateState('dodge', { ...state.dodge, rollResult: 0, lastRolls: [] });
    const clearedSkills = state.skills.list.map(s => ({ ...s, rollResult: 0, lastRoll: null }));
    updateState('skills', { ...state.skills, list: clearedSkills });
    updateState('lastRolls', {});
  };

  // Character management functions
  const getCharacterList = () => {
    const saved = localStorage.getItem('characterList');
    return saved ? JSON.parse(saved) : ['default'];
  };

  const [characterList, setCharacterList] = useState(getCharacterList());

  const switchCharacter = (characterId) => {
    setCurrentCharacter(characterId);
    setShowCharacterManager(false);
  };

  const createCharacter = (name) => {
    const newList = [...characterList, name];
    setCharacterList(newList);
    localStorage.setItem('characterList', JSON.stringify(newList));
    setCurrentCharacter(name);
  };

  const deleteCharacter = (name) => {
    if (characterList.length <= 1) return;
    const newList = characterList.filter(c => c !== name);
    setCharacterList(newList);
    localStorage.setItem('characterList', JSON.stringify(newList));
    if (currentCharacter === name) {
      setCurrentCharacter(newList[0]);
    }
    // Remove character data
    localStorage.removeItem(`gameSheet_${name}`);
  };

  const moveComponent = (fromIndex, toIndex) => {
    const newOrder = [...layoutOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setLayoutOrder(newOrder);
  };

  const renderComponent = (componentName) => {
    const components = {
      dodge: <Dodge key="dodge" state={state} updateState={updateState} rollDice={rollDice} />,
      skills: <Skills key="skills" state={state} updateState={updateState} rollDice={rollDice} />,
      health: <Health key="health" state={state} updateState={updateState} />,
      defense: <Defense key="defense" state={state} updateState={updateState} />,
      speed: <Speed key="speed" state={state} updateState={updateState} />,
      actionPoints: <ActionPoints key="actionPoints" state={state} updateState={updateState} />,
      attacks: <Attacks key="attacks" state={state} updateState={updateState} rollDice={rollDice} performRoll={performRoll} />
    };
    return components[componentName];
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <GlobalBackground />
      <AppContainer theme={theme}>
        <ButtonContainer>
          <CharacterButton onClick={() => setShowCharacterManager(!showCharacterManager)}>
            📁 Characters
          </CharacterButton>
          <ThemeToggle />
          <ExportButton onClick={exportPDF}>PDF Export</ExportButton>
          <ResetButton onClick={resetRolls}>Reset Rolls</ResetButton>
        </ButtonContainer>

        {showCharacterManager && (
          <CharacterManager
            characters={characterList}
            currentCharacter={currentCharacter}
            onCharacterChange={switchCharacter}
            onCharacterCreate={createCharacter}
            onCharacterDelete={deleteCharacter}
            onClose={() => setShowCharacterManager(false)}
          />
        )}

        <Header state={state} updateState={updateState} currentCharacter={currentCharacter} />
        
        <FlexibleGrid>
          {layoutOrder.map((componentName, index) => (
            <DraggableSection 
              key={componentName}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                moveComponent(fromIndex, index);
              }}
            >
              {renderComponent(componentName)}
            </DraggableSection>
          ))}
        </FlexibleGrid>
        
        <NotesPanel state={state} updateState={updateState} />
      </AppContainer>
    </DndProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// ---------------------------------------------------------------------
//  STYLES
// ---------------------------------------------------------------------
const AppContainer = styled.div`
  position: relative;
  background: ${p => p.theme.gradient};
  color: ${p => p.theme.text};
  font-family: 'Cinzel', serif;
  padding: 20px;
  min-height: 100vh;
  max-width: 1300px;
  margin: 0 auto;
  border: 3px solid ${p => p.theme.borderAccent};
  border-radius: 12px;
  overflow-x: hidden;
`;

const ButtonContainer = styled.div`
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 1000;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ExportButton = styled.button`
  background: ${p => p.theme.button};
  color: ${p => p.theme.buttonText};
  border: 2px solid ${p => p.theme.borderAccent};
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  &:hover { background: ${p => p.theme.buttonHover}; }
`;

const ResetButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  font-size: 13px;
  &:hover { background: #dc2626; }
`;

const CharacterButton = styled.button`
  background: ${p => p.theme.button};
  color: ${p => p.theme.buttonText};
  border: 2px solid ${p => p.theme.borderAccent};
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  &:hover { background: ${p => p.theme.buttonHover}; }
`;

const FlexibleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const DraggableSection = styled.div`
  cursor: move;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &[draggable="true"]:active {
    opacity: 0.8;
  }
`;