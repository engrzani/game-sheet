// src/App.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ThemeProvider, useTheme } from './context/ThemeContext';

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

  dodge: {
    base: 0,
    mods: 0,
    diceCount: 1,
    rollResult: 0,
    lastRolls: []
  },

  skills: {
    list: [
      { name: 'Power',    base: 0, mods: 0, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Reflexes', base: 0, mods: 0, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Guts',     base: 0, mods: 0, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Charm',    base: 0, mods: 0, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Smarts',   base: 0, mods: 0, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Psyche',   base: 0, mods: 0, dubs: false, rollResult: 0, lastRoll: null },
      { name: 'Wits',     base: 0, mods: 0, dubs: false, rollResult: 0, lastRoll: null }
    ]
  },

  speed: { base: 0, mods: 0 },
  timing: { base: 0, mods: 0, rollResult: 0 },
  actionPoints: { current: 5, max: 10, carriedOver: false },

  attacks: {
    meleeLight:  { dice: 1, base: 0, mods: 0, apCost: 2, rollResult: 0 },
    meleeHeavy:  { dice: 2, base: 0, mods: 0, apCost: 3, rollResult: 0 },
    rangedLight: { dice: 1, base: 0, mods: 0, apCost: 2, rollResult: 0 },
    rangedHeavy: { dice: 2, base: 0, mods: 0, apCost: 3, rollResult: 0 },
    etherLight:  { dice: 1, base: 0, mods: 0, apCost: 2, rollResult: 0 },
    etherHeavy:  { dice: 2, base: 0, mods: 0, apCost: 3, rollResult: 0 }
  },

  lastRolls: {}
};

// ---------------------------------------------------------------------
//  APP CONTENT
// ---------------------------------------------------------------------
function AppContent() {
  const { theme } = useTheme();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const saved = localStorage.getItem('gameSheet');
    if (saved) setState(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('gameSheet', JSON.stringify(state));
  }, [state]);

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
    updateState('timing', { ...state.timing, rollResult: 0 });
    const clearedSkills = state.skills.list.map(s => ({ ...s, rollResult: 0, lastRoll: null }));
    updateState('skills', { ...state.skills, list: clearedSkills });
    const clearedAttacks = Object.fromEntries(
      Object.entries(state.attacks).map(([k, a]) => [k, { ...a, rollResult: 0 }])
    );
    updateState('attacks', clearedAttacks);
    updateState('lastRolls', {});
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <GlobalBackground />
      <AppContainer>
        <ButtonContainer>
          <ThemeToggle />
          <ExportButton onClick={exportPDF}>PDF Export</ExportButton>
          <ResetButton onClick={resetRolls}>Reset Rolls</ResetButton>
        </ButtonContainer>

        <Header state={state} updateState={updateState} />
        <MainGrid>
          <LeftPanel>
            <Dodge state={state} updateState={updateState} rollDice={rollDice} />
            <Skills state={state} updateState={updateState} rollDice={rollDice} />
          </LeftPanel>
          <MiddlePanel>
            <Health state={state} updateState={updateState} />
            <Defense state={state} updateState={updateState} />
            <Speed state={state} updateState={updateState} />
            <Timing state={state} updateState={updateState} rollDice={rollDice} />
            <ActionPoints state={state} updateState={updateState} />
          </MiddlePanel>
          <RightPanel>
            <Attacks state={state} updateState={updateState} rollDice={rollDice} />
          </RightPanel>
        </MainGrid>
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

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  margin-top: 20px;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const LeftPanel = styled.div``;
const MiddlePanel = styled.div``;
const RightPanel = styled.div``;