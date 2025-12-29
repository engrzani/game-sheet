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
  const [conditions, setConditions] = useState({
    bloodied: false,
    wounded: false,
    critical: false,
    dying: false,
    stabilized: false
  });

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

  const toggleCondition = (key) => {
    setConditions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Section theme={theme} style={{ borderLeftColor: theme.sectionBorderGrey }}>
      <h3>Health</h3>
      
      <MaxHealthDisplay theme={theme}>
        <strong>Maximum Health: {max}</strong>
      </MaxHealthDisplay>

      <HealthLayout>
        <StatsColumn>
          <div style={{ fontSize: '15px', marginBottom: '6px' }}>
            Temp: {h.temp} <Btn theme={theme} onClick={() => adj('temp', 1)}>+</Btn><Btn theme={theme} onClick={() => adj('temp', -1)}>-</Btn>
          </div>

          <div style={{ fontSize: '15px', marginBottom: '6px' }}>
            Base: {h.base} <Btn theme={theme} onClick={() => adj('base', 1)}>+</Btn><Btn theme={theme} onClick={() => adj('base', -1)}>-</Btn>
          </div>

          <div style={{ fontSize: '15px', marginBottom: '6px' }}>
            Equip: {h.equip} <Btn theme={theme} onClick={() => adj('equip', 1)}>+</Btn><Btn theme={theme} onClick={() => adj('equip', -1)}>-</Btn>
          </div>

          <div style={{ fontSize: '15px', marginBottom: '6px' }}>
            Mods: {h.mods} <Btn theme={theme} onClick={() => adj('mods', 1)}>+</Btn><Btn theme={theme} onClick={() => adj('mods', -1)}>-</Btn>
          </div>
        </StatsColumn>
        
        <AdjustColumn theme={theme}>
          <CurrentHealthLabel>Current: {h.current}</CurrentHealthLabel>
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
        </AdjustColumn>
        
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
      </HealthLayout>
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

const HealthLayout = styled.div`
  display: flex;
  gap: 16px;
`;

const StatsColumn = styled.div`
  flex: 1;
`;

const AdjustColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: ${props => props.theme.inputBg};
  border-radius: 4px;
  border: 2px solid ${props => props.theme.borderAccent};
  min-width: 130px;
`;

const CurrentHealthLabel = styled.div`
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 4px;
  text-align: center;
`;

const AdjustLabel = styled.span`
  font-size: 13px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 3px;
`;

const ConditionsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 110px;
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
  gap: 6px;
`;

const ConditionToggle = styled.button`
  background: ${props => props.$active ? props.theme.borderAccent : props.theme.sectionBg};
  color: ${props => props.$active ? '#000' : props.theme.text};
  border: 1px solid ${props => props.theme.border};
  padding: 3px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  min-width: 35px;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ConditionName = styled.span`
  font-size: 12px;
  font-weight: 500;
`;