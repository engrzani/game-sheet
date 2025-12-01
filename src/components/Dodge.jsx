// src/components/Dodge.jsx
import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';

export default function Dodge({ state, updateState, rollDice }) {
  const { theme } = useTheme();
  const d = state.dodge;
  const bonus = d.base + d.mods;
  const [conditions, setConditions] = useState({
    swarm: false,
    traps: false,
    aoe: false,
    exploited: false,
    prone: false
  });
  const [dubs, setDubs] = useState(false);
  
  const adj = (field, delta) => {
    if (field === 'diceCount') {
      const newVal = Math.max(1, Math.min(6, d.diceCount + delta));
      updateState('dodge', { ...d, diceCount: newVal });
    } else {
      const newVal = Math.max(0, d[field] + delta);
      updateState('dodge', { ...d, [field]: newVal });
    }
  };
  
  const roll = () => {
    const r1 = rollDice(6, d.diceCount);
    let finalRoll = r1.total;
    let displayRolls = r1.rolls;
    
    if (dubs) {
      const r2 = rollDice(6, d.diceCount);
      // Combine both sets and choose best N dice
      const allDice = [...r1.rolls, ...r2.rolls];
      const sorted = [...allDice].sort((a, b) => b - a);
      const bestDice = sorted.slice(0, d.diceCount);
      finalRoll = bestDice.reduce((sum, val) => sum + val, 0);
      // Display: best dice / other dice
      const otherDice = sorted.slice(d.diceCount);
      displayRolls = [...bestDice, '/', ...otherDice];
    }
    
    const total = finalRoll + bonus;
    updateState('dodge', {
      ...d,
      rollResult: total,
      lastRolls: displayRolls,
      bonus: bonus
    });
  };

  const toggleCondition = (key) => {
    setConditions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Section theme={theme} style={{ borderLeftColor: theme.sectionBorderYellow }}>
      <h3>Dodge ({d.diceCount}d6 + {bonus})</h3>
      
      <DodgeLayout>
        <MainColumn>
          <div style={{ fontSize: '15px', marginBottom: '6px' }}>
            Base: {d.base} <Btn theme={theme} onClick={() => adj('base', 1)}>+</Btn><Btn theme={theme} onClick={() => adj('base', -1)}>-</Btn>
          </div>

          <div style={{ fontSize: '15px', marginBottom: '6px' }}>
            Mods: {d.mods} <Btn theme={theme} onClick={() => adj('mods', 1)}>+</Btn><Btn theme={theme} onClick={() => adj('mods', -1)}>-</Btn>
          </div>

          <div style={{ fontSize: '15px', marginBottom: '6px' }}>
            Dice: {d.diceCount} <Btn theme={theme} onClick={() => adj('diceCount', 1)}>+</Btn><Btn theme={theme} onClick={() => adj('diceCount', -1)}>-</Btn>
          </div>
          
          <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' }}>
            Total Bonus: +{bonus}
          </div>
          
          <DubsCheckbox>
            <input 
              type="checkbox" 
              checked={dubs} 
              onChange={() => setDubs(!dubs)}
              id="dodge-dubs"
            />
            <label htmlFor="dodge-dubs">Dubs/Nubs</label>
          </DubsCheckbox>

          {d.rollResult > 0 && d.lastRolls && (
            <div style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '8px', padding: '6px', background: 'rgba(255,215,0,0.1)', borderRadius: '4px', border: '1px solid ' + theme.borderAccent }}>
              Result: {d.rollResult} ({d.lastRolls.map(r => r === '/' ? ' / ' : r).join(', ').replace(', / ,', ' /')} + {d.bonus})
            </div>
          )}

          <RollButton theme={theme} onClick={roll}>
            Roll Dodge
          </RollButton>
        </MainColumn>
        
        <ConditionsColumn theme={theme}>
          <ConditionLabel>Conditions:</ConditionLabel>
          {Object.entries(conditions).map(([key, value]) => (
            <ConditionRow key={key}>
              <ConditionToggle
                theme={theme}
                $active={value}
                onClick={() => toggleCondition(key)}
              >
                {value ? 'Yes' : 'No'}
              </ConditionToggle>
              <ConditionName>{key.charAt(0).toUpperCase() + key.slice(1)}</ConditionName>
            </ConditionRow>
          ))}
        </ConditionsColumn>
      </DodgeLayout>
    </Section>
  );
}

const DodgeLayout = styled.div`
  display: flex;
  gap: 16px;
`;

const MainColumn = styled.div`
  flex: 1;
`;

const ConditionsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 100px;
  padding: 8px;
  background: ${props => props.theme.inputBg};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
`;

const ConditionLabel = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 6px;
  text-align: center;
`;

const ConditionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConditionToggle = styled.button`
  background: ${props => props.$active ? props.theme.borderAccent : props.theme.button};
  color: ${props => props.$active ? '#000' : props.theme.buttonText};
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  min-width: 40px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? props.theme.borderAccent : props.theme.buttonHover};
    transform: scale(1.05);
  }
`;

const ConditionName = styled.span`
  font-size: 12px;
  font-weight: 500;
`;

const DubsCheckbox = styled.div`
  margin: 8px 0;
  
  input {
    margin-right: 6px;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
  
  label {
    font-size: 13px;
    cursor: pointer;
  }
`;

const RollButton = styled.button`
  background: ${props => props.theme.button};
  color: ${props => props.theme.buttonText};
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 13px;
  font-weight: bold;
  
  &:hover {
    background: ${props => props.theme.buttonHover};
  }
`;