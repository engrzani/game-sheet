// src/components/Health.jsx
import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';

export default function Health({ state, updateState }) {
  const { theme } = useTheme();
  const h = state.health;
  const max = h.base + h.equip + h.mods;
  const [adjustValue, setAdjustValue] = useState(1);

  const adj = (field, delta) => {
    let newValue = h[field] + delta;
    
    // Ensure Current Health never exceeds Maximum Health
    if (field === 'current') {
      newValue = Math.max(0, Math.min(max, newValue));
    } else {
      newValue = Math.max(0, newValue);
    }
    
    updateState('health', {
      ...h,
      [field]: newValue
    });
  };

  const handleAdjustValueChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setAdjustValue(Math.max(0, val));
  };

  return (
    <Section theme={theme} style={{ borderLeftColor: theme.sectionBorderGrey }}>
      <h3>Health</h3>
      
      <MaxHealthDisplay theme={theme}>
        <strong>Maximum Health: {max}</strong>
      </MaxHealthDisplay>

      <CurrentHealthSection theme={theme}>
        <CurrentHealthLabel>Current Health</CurrentHealthLabel>
        <CurrentHealthValue theme={theme}>{h.current}</CurrentHealthValue>
        
        <AdjustmentRow>
          <AdjustLabel>Adjust by:</AdjustLabel>
          <AdjustInput 
            theme={theme}
            type="number" 
            value={adjustValue} 
            onChange={handleAdjustValueChange}
            min="0"
          />
          <ButtonGroup>
            <Btn theme={theme} onClick={() => adj('current', adjustValue)}>+</Btn>
            <Btn theme={theme} onClick={() => adj('current', -adjustValue)}>-</Btn>
          </ButtonGroup>
        </AdjustmentRow>
      </CurrentHealthSection>

      <Divider theme={theme} />

      <SmallStatRow theme={theme}>
        <label>Temp:</label>
        <span>{h.temp}</span>
        <ButtonGroup>
          <Btn theme={theme} onClick={() => adj('temp', 1)}>+</Btn>
          <Btn theme={theme} onClick={() => adj('temp', -1)}>-</Btn>
        </ButtonGroup>
      </SmallStatRow>

      <SmallStatRow theme={theme}>
        <label>Base:</label>
        <span>{h.base}</span>
        <ButtonGroup>
          <Btn theme={theme} onClick={() => adj('base', 1)}>+</Btn>
          <Btn theme={theme} onClick={() => adj('base', -1)}>-</Btn>
        </ButtonGroup>
      </SmallStatRow>

      <SmallStatRow theme={theme}>
        <label>Equip:</label>
        <span>{h.equip}</span>
        <ButtonGroup>
          <Btn theme={theme} onClick={() => adj('equip', 1)}>+</Btn>
          <Btn theme={theme} onClick={() => adj('equip', -1)}>-</Btn>
        </ButtonGroup>
      </SmallStatRow>

      <SmallStatRow theme={theme}>
        <label>Mods:</label>
        <span>{h.mods}</span>
        <ButtonGroup>
          <Btn theme={theme} onClick={() => adj('mods', 1)}>+</Btn>
          <Btn theme={theme} onClick={() => adj('mods', -1)}>-</Btn>
        </ButtonGroup>
      </SmallStatRow>
    </Section>
  );
}

const MaxHealthDisplay = styled.div`
  color: ${props => props.theme.text};
  margin-bottom: 12px;
  font-size: 15px;
  text-align: center;
  font-weight: bold;
`;

const CurrentHealthSection = styled.div`
  background: ${props => props.theme.inputBg};
  padding: 20px;
  border-radius: 8px;
  border: 2px solid ${props => props.theme.borderAccent};
  margin-bottom: 16px;
`;

const CurrentHealthLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
`;

const CurrentHealthValue = styled.div`
  font-size: 52px;
  font-weight: bold;
  text-align: center;
  color: ${props => props.theme.borderAccent};
  margin-bottom: 14px;
  line-height: 1;
`;

const AdjustmentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const AdjustLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const AdjustInput = styled.input`
  width: 65px;
  padding: 7px;
  text-align: center;
  background: ${props => props.theme.sectionBg};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 15px;
  font-weight: bold;
`;

const Divider = styled.div`
  height: 1px;
  background: ${props => props.theme.border};
  margin: 18px 0;
`;

const SmallStatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
  padding: 3px 0;
  
  label {
    color: ${props => props.theme.text};
    font-weight: 500;
    min-width: 70px;
    font-size: 15px;
  }
  
  span {
    color: ${props => props.theme.textSecondary};
    font-weight: bold;
    min-width: 35px;
    text-align: center;
    font-size: 15px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 3px;
`;