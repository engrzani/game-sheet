import { Btn, Section, Select } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';
import styled from 'styled-components';

export default function Defense({ state, updateState }) {
  const { theme } = useTheme();
  const d = state.defense;
  const [selectedType, setSelectedType] = useState('');

  const commonTypes = ['ether', 'fire', 'air', 'water', 'earth', 'light', 'shadow'];

  const setPhysical = delta =>
    updateState('defense', { ...d, physical: Math.max(0, d.physical + delta) });

  const setNon = (type, delta) => {
    const newVal = Math.max(0, (d.nonPhysical[type] || 0) + delta);
    updateState('defense', {
      ...d,
      nonPhysical: { ...d.nonPhysical, [type]: newVal }
    });
  };

  const deleteType = (type) => {
    const newNonPhysical = { ...d.nonPhysical };
    delete newNonPhysical[type];
    updateState('defense', { ...d, nonPhysical: newNonPhysical });
  };

  const addTypeFromDropdown = () => {
    if (selectedType && !d.nonPhysical[selectedType]) {
      setNon(selectedType, 0);
      setSelectedType('');
    }
  };

  const addCustomType = () => {
    const t = prompt('New damage type (e.g. Poison):');
    if (t) {
      const typeName = t.toLowerCase().trim();
      if (!d.nonPhysical[typeName]) {
        setNon(typeName, 0);
      }
    }
  };

  return (
    <Section theme={theme} style={{ borderLeftColor: theme.sectionBorderGrey }}>
      <h3>Defense</h3>
      
      <DefenseRow>
        <strong>Physical: {d.physical}</strong>{' '}
        <Btn theme={theme} onClick={() => setPhysical(1)}>+</Btn>
        <Btn theme={theme} onClick={() => setPhysical(-1)}>-</Btn>
      </DefenseRow>

      <h4 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '14px' }}>Non-Physical</h4>
      
      <DropdownRow>
        <Select 
          theme={theme} 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="">Select damage type...</option>
          {commonTypes.filter(type => !d.nonPhysical[type]).map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </Select>
        <AddButton 
          theme={theme}
          onClick={addTypeFromDropdown} 
          disabled={!selectedType}
        >
          Add
        </AddButton>
      </DropdownRow>

      {Object.entries(d.nonPhysical).map(([type, val]) => (
        <TypeRow key={type}>
          <TypeLabel>{type.charAt(0).toUpperCase() + type.slice(1)}: {val}</TypeLabel>
          <ButtonContainer>
            <Btn theme={theme} onClick={() => setNon(type, 1)}>+</Btn>
            <Btn theme={theme} onClick={() => setNon(type, -1)}>-</Btn>
            <DeleteBtn theme={theme} onClick={() => deleteType(type)}>×</DeleteBtn>
          </ButtonContainer>
        </TypeRow>
      ))}
      
      <AddTypeButton theme={theme} onClick={addCustomType}>
        + Add Type
      </AddTypeButton>

      <h4 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '14px' }}>Other Effects</h4>
      <textarea
        rows={2}
        value={d.otherEffects}
        onChange={e => updateState('defense', { ...d, otherEffects: e.target.value })}
        placeholder="e.g. Immune to Fire"
        style={{
          width: '100%',
          background: theme.inputBg,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: '4px',
          padding: '6px',
          fontSize: '13px'
        }}
      />
    </Section>
  );
}

const DefenseRow = styled.div`
  margin-bottom: 12px;
  font-size: 14px;
`;

const DropdownRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const AddButton = styled.button`
  background: ${props => props.theme.button};
  color: ${props => props.theme.buttonText};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.buttonHover};
  }
`;

const TypeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 6px;
  background: ${props => props.theme.inputBg};
  border-radius: 4px;
`;

const TypeLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const DeleteBtn = styled(Btn)`
  background: #ff4444;
  
  &:hover {
    background: #ff6666;
  }
`;

const AddTypeButton = styled.button`
  background: ${props => props.theme.button};
  color: ${props => props.theme.buttonText};
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 12px;
  font-size: 13px;
  
  &:hover {
    background: ${props => props.theme.buttonHover};
  }
`;