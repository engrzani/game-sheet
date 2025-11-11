// src/App.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Theme
import ThemeProvider from './context/ThemeContext';
import { useTheme } from './hooks/useTheme';

// Components
import Header from './components/Header';
import Health from './components/Health';
import Defense from './components/Defense';
import Dodge from './components/Dodge';
import Skills from './components/Skills';
import Speed from './components/Speed';
import Timing from './components/Timing';
import ActionPoints from './components/ActionPoints';
import Attacks from './components/Attacks';
import ThemeToggle from './components/ThemeToggle';
import GlobalBackground from './components/GlobalBackground';

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
    nonPhysical: { ether: 0, fire: 0, air: 0, water: 0, earth: 0, light: 0, shadow: 0 },
    otherEffects: ''
  },

  // ONE DODGE OBJECT (diceCount + lastRolls)
  dodge: {
    base: 0,
    mods: 0,
    diceCount: 1,
    rollResult: 0,
    lastRolls: []          // array of raw dice values
  },

  skills: {
    dubs: false,
    list: [
      { name: 'Power',    base: 0, mods: 0, rollResult: 0 },
      { name: 'Reflexes', base: 0, mods: 0, rollResult: 0 },
      { name: 'Guts',     base: 0, mods: 0, rollResult: 0 },
      { name: 'Charm',    base: 0, mods: 0, rollResult: 0 },
      { name: 'Smarts',   base: 0, mods: 0, rollResult: 0 },
      { name: 'Psyche',   base: 0, mods: 0, rollResult: 0 },
      { name: 'Wits',     base: 0, mods: 0, rollResult: 0 }
    ]
  },

  speed: { base: 0, mods: 0 },
  timing: { base: 0, mods: 0, rollResult: 0 },

  actionPoints: { current: 5, max: 10, carriedOver: false },

  lastRolls: {}   // for attack results
};

// ---------------------------------------------------------------------
//  APP CONTENT COMPONENT (uses theme)
// ---------------------------------------------------------------------
function AppContent() {
  const { theme } = useTheme();
  const [state, setState] = useState(initialState);

  // ---------- persistence ----------
  useEffect(() => {
    const saved = localStorage.getItem('gameSheet');
    if (saved) setState(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('gameSheet', JSON.stringify(state));
  }, [state]);

  // ---------- helpers ----------
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

  // ---------- PDF EXPORT ----------
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
    line(`Speed: ${state.speed.base + state.speed.mods} (half: ${Math.floor((state.speed.base + state.speed.mods) / 2)})`);
    line(`Timing: ${state.timing.base + state.timing.mods}`);
    line(`AP: ${state.actionPoints.current} (carry: ${state.actionPoints.carriedOver ? '+1' : '0'})`);

    doc.save('character-sheet.pdf');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <GlobalBackground />
      <AppContainer theme={theme}>

        {/* Fixed Buttons Container */}
        <ButtonContainer>
          <ThemeToggle />
          <ExportButton theme={theme} onClick={exportPDF}>Export PDF</ExportButton>
        </ButtonContainer>

        <Header state={state} updateState={updateState} />

        <MainGrid>
          {/* LEFT – rolls & inputs */}
          <LeftPanel>
            <Dodge state={state} updateState={updateState} rollDice={rollDice} />
            <Skills state={state} updateState={updateState} rollDice={rollDice} />
          </LeftPanel>

          {/* MIDDLE – core stats */}
          <MiddlePanel>
            <Health state={state} updateState={updateState} />
            <Defense state={state} updateState={updateState} />
            <Speed state={state} updateState={updateState} />
            <Timing state={state} updateState={updateState} rollDice={rollDice} />
            <ActionPoints state={state} updateState={updateState} />
          </MiddlePanel>

          {/* RIGHT – attacks */}
          <RightPanel>
            <Attacks state={state} updateState={updateState} performRoll={performRoll} />
          </RightPanel>
        </MainGrid>
      </AppContainer>
    </DndProvider>
  );
}

// ---------------------------------------------------------------------
//  MAIN APP COMPONENT (provides theme)
// ---------------------------------------------------------------------
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// ---------------------------------------------------------------------
//  STYLED COMPONENTS
// ---------------------------------------------------------------------
const AppContainer = styled.div`
  position: relative;
  background: ${props => props.theme.gradient};
  color: ${props => props.theme.text};
  font-family: 'Cinzel', serif;
  padding: 20px;
  min-height: 100vh;
  max-width: 1300px;
  margin: 0 auto;
  border: 3px solid ${props => props.theme.borderAccent};
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  
  /* Fix background overflow issue */
  overflow-x: hidden;
  
  /* Responsive padding */
  @media (max-width: 768px) {
    padding: 15px;
    margin: 10px;
    border-width: 2px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    margin: 5px;
    border-radius: 8px;
  }
`;

const ButtonContainer = styled.div`
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 100;
  display: flex;
  gap: 8px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    top: 8px;
    right: 8px;
    gap: 4px;
  }
`;

const ExportButton = styled.button`
  background: ${props => props.theme.button};
  color: ${props => props.theme.buttonText};
  border: 2px solid ${props => props.theme.borderAccent};
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: static; /* Remove fixed positioning */
  
  &:hover { 
    background: ${props => props.theme.buttonHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 12px;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const LeftPanel = styled.div``;
const MiddlePanel = styled.div``;
const RightPanel = styled.div``;