import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';

export default function Attacks({ state, updateState, rollDice }) {
  const { theme } = useTheme();
  const ap = state.actionPoints;
  const attacks = state.attacks || [];

  const addAttack = () => {
    const newId = Math.max(...attacks.map(a => a.id), 0) + 1;
    // Copy values from the last attack to create connection
    const lastAttack = attacks[attacks.length - 1];
    const newAttacks = [...attacks, {
      id: newId,
      selectedTypes: { ...lastAttack.selectedTypes },
      dice: lastAttack.dice,
      base: lastAttack.base,
      equip: lastAttack.equip,
      mods: lastAttack.mods,
      apCost: lastAttack.apCost,
      dubs: lastAttack.dubs
    }];
    updateState('attacks', newAttacks);
  };

  const removeAttack = (id) => {
    if (attacks.length > 1) {
      updateState('attacks', attacks.filter(a => a.id !== id));
    }
  };

  const toggleType = (attackId, type) => {
    const newAttacks = attacks.map(atk => {
      if (atk.id !== attackId) return atk;
      return { 
        ...atk, 
        selectedTypes: { 
          ...atk.selectedTypes, 
          [type]: !atk.selectedTypes[type] 
        } 
      };
    });
    updateState('attacks', newAttacks);
  };

  const adjustValue = (attackId, field, delta) => {
    const newAttacks = attacks.map(atk => {
      if (atk.id !== attackId) return atk;
      return { 
        ...atk, 
        [field]: Math.max(0, (atk[field] || 0) + delta) 
      };
    });
    updateState('attacks', newAttacks);
  };

  const toggleDubs = (attackId) => {
    const newAttacks = attacks.map(atk => {
      if (atk.id !== attackId) return atk;
      return { ...atk, dubs: !atk.dubs };
    });
    updateState('attacks', newAttacks);
  };

  const setApCost = (attackId, value) => {
    const newAttacks = attacks.map(atk => {
      if (atk.id !== attackId) return atk;
      const numValue = parseInt(value) || 0;
      return { 
        ...atk, 
        apCost: Math.max(0, Math.min(5, numValue)) 
      };
    });
    updateState('attacks', newAttacks);
  };

  const rollAttack = (attack) => {
    // Create a copy to ensure no reference sharing
    const attackCopy = { ...attack };
    
    if (attackCopy.apCost > 0 && ap.current < attackCopy.apCost) {
      alert('Not enough AP!');
      return;
    }

    if (attackCopy.apCost > 0) {
      updateState('actionPoints', { 
        ...ap, 
        current: ap.current - attackCopy.apCost 
      });
    }
    
    if (rollDice && attackCopy.dice > 0) {
      const r1 = rollDice(6, attackCopy.dice);
      let finalRoll = r1.total;
      let displayRolls = r1.rolls;
      
      if (attackCopy.dubs) {
        const r2 = rollDice(6, attackCopy.dice);
        // Combine both sets and choose best N dice
        const allDice = [...r1.rolls, ...r2.rolls];
        const sorted = [...allDice].sort((a, b) => b - a);
        const bestDice = sorted.slice(0, attackCopy.dice);
        finalRoll = bestDice.reduce((sum, val) => sum + val, 0);
        // Display: best dice / other dice
        const otherDice = sorted.slice(attackCopy.dice);
        displayRolls = [...bestDice, '/', ...otherDice];
      }
      
      const bonus = (attackCopy.base || 0) + (attackCopy.equip || 0) + (attackCopy.mods || 0);
      const total = finalRoll + bonus;
      
      // Build full word label
      const typeWords = Object.entries(attackCopy.selectedTypes)
        .filter(([, checked]) => checked)
        .map(([type]) => type.charAt(0).toUpperCase() + type.slice(1));
      
      const label = typeWords.length > 0 ? typeWords.join(' ') : `Attack #${attackCopy.id}`;
      
      // Format display properly
      const formattedDisplay = displayRolls.map(r => r === '/' ? ' / ' : r).join(', ').replace(', / ,', ' /');
      
      updateState('lastRolls', { 
        ...state.lastRolls, 
        [label]: `${total} (${formattedDisplay} + ${bonus})`
      });
    }
  };

  const attackTypes = [
    { key: 'light', label: 'Light' },
    { key: 'heavy', label: 'Heavy' },
    { key: 'melee', label: 'Melee' },
    { key: 'ranged', label: 'Ranged' },
    { key: 'ether', label: 'Ether' }
  ];

  return (
    <Section theme={theme} style={{ borderLeftColor: theme.sectionBorderYellow }}>
      <h3>Attacks</h3>
      
      <AttacksGrid>
      {attacks.map((attack, index) => (
        <AttackBlock key={attack.id} theme={theme}>
          <AttackHeader theme={theme}>
            <AttackTitle>Attack #{index + 1}</AttackTitle>
            {attacks.length > 1 && (
              <RemoveButton theme={theme} onClick={() => removeAttack(attack.id)}>
                Remove
              </RemoveButton>
            )}
          </AttackHeader>
          
          <AttackLayout>
            <CheckboxColumn>
              <CheckboxLabel>Check Types:</CheckboxLabel>
              {attackTypes.map(({ key, label }) => (
                <CheckboxRow key={key}>
                  <Checkbox 
                    type="checkbox" 
                    checked={attack.selectedTypes[key]}
                    onChange={() => toggleType(attack.id, key)}
                  />
                  <Label>{label}</Label>
                </CheckboxRow>
              ))}
            </CheckboxColumn>

            <StatsColumn>
              <StatRow>
                <StatLabel>Roll</StatLabel>
                <StatValue>{attack.dice}</StatValue>
                <Btn theme={theme} onClick={() => adjustValue(attack.id, 'dice', 1)}>+</Btn>
                <Btn theme={theme} onClick={() => adjustValue(attack.id, 'dice', -1)}>-</Btn>
              </StatRow>

              <StatRow>
                <StatLabel>Dice</StatLabel>
              </StatRow>

              <StatRow>
                <StatLabel>+ Base</StatLabel>
                <StatValue>{attack.base}</StatValue>
                <Btn theme={theme} onClick={() => adjustValue(attack.id, 'base', 1)}>+</Btn>
                <Btn theme={theme} onClick={() => adjustValue(attack.id, 'base', -1)}>-</Btn>
              </StatRow>

              <StatRow>
                <StatLabel>+ Equip</StatLabel>
                <StatValue>{attack.equip}</StatValue>
                <Btn theme={theme} onClick={() => adjustValue(attack.id, 'equip', 1)}>+</Btn>
                <Btn theme={theme} onClick={() => adjustValue(attack.id, 'equip', -1)}>-</Btn>
              </StatRow>

              <StatRow>
                <StatLabel>+ Mods</StatLabel>
                <StatValue>{attack.mods}</StatValue>
                <Btn theme={theme} onClick={() => adjustValue(attack.id, 'mods', 1)}>+</Btn>
                <Btn theme={theme} onClick={() => adjustValue(attack.id, 'mods', -1)}>-</Btn>
              </StatRow>
            </StatsColumn>

            <APColumn>
              <APLabel>AP cost</APLabel>
              <APInputBox>
                <APInput 
                  type="number"
                  value={attack.apCost}
                  onChange={(e) => setApCost(attack.id, parseInt(e.target.value) || 0)}
                  min="0"
                  max="5"
                />
              </APInputBox>
              <APNote>0-5, number selected</APNote>
              <APNote>Reduces AP by</APNote>
              <APNote>that amount</APNote>
            </APColumn>
          </AttackLayout>
          
          <DubsRow>
            <DubsCheckbox>
              <input 
                type="checkbox" 
                checked={attack.dubs}
                onChange={() => toggleDubs(attack.id)}
                id={`attack-dubs-${attack.id}`}
              />
              <label htmlFor={`attack-dubs-${attack.id}`}>Dubs/Nubs</label>
            </DubsCheckbox>
          </DubsRow>

          <RollButton theme={theme} onClick={() => rollAttack(attack)}>
            Roll Attack #{index + 1}
          </RollButton>
        </AttackBlock>
      ))}
      </AttacksGrid>
      
      <AddAttackButton theme={theme} onClick={addAttack}>
        + Add New Attack
      </AddAttackButton>

      {Object.keys(state.lastRolls).length > 0 && (
        <LastRollsSection>
          <h4 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '15px' }}>Last Rolls</h4>
          {Object.entries(state.lastRolls).map(([k, v]) => (
            <RollEntry key={k} theme={theme}>
              <RollLabel>{k}:</RollLabel>
              <RollValue>{v}</RollValue>
            </RollEntry>
          ))}
        </LastRollsSection>
      )}
    </Section>
  );
}

const AttacksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const AttackBlock = styled.div`
  background: ${props => props.theme.inputBg};
  border: 2px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 12px;
`;

const AttackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const AttackTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  color: ${props => props.theme.borderAccent};
`;

const RemoveButton = styled.button`
  background: #c44;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #a33;
  }
`;

const AttackLayout = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  border: 1px solid ${props => props.theme.border};
  padding: 12px;
  border-radius: 6px;
`;

const CheckboxColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 100px;
`;

const CheckboxLabel = styled.div`
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const StatsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatLabel = styled.span`
  min-width: 60px;
  font-size: 14px;
  font-weight: 500;
`;

const StatValue = styled.span`
  min-width: 30px;
  text-align: center;
  font-weight: bold;
  font-size: 15px;
`;

const APColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 120px;
  padding: 8px;
  border-left: 1px solid ${props => props.theme.border};
`;

const APLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const APInputBox = styled.div`
  border: 2px solid ${props => props.theme.border};
  padding: 4px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const APInput = styled.input`
  width: 60px;
  padding: 4px;
  text-align: center;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  border: none;
  font-size: 17px;
  font-weight: bold;
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;

const APNote = styled.div`
  font-size: 11px;
  text-align: center;
  color: ${props => props.theme.textMuted};
  line-height: 1.2;
`;

const DubsRow = styled.div`
  margin: 8px 0;
`;

const DubsCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  
  input {
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
  width: 100%;
  background: ${props => props.theme.button};
  color: ${props => props.theme.buttonText};
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.buttonHover};
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const AddAttackButton = styled.button`
  width: 100%;
  background: ${props => props.theme.borderAccent};
  color: #000;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
  margin-top: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }
`;

const LastRollsSection = styled.div`
  margin-top: 16px;
`;

const RollEntry = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  font-size: 13px;
  background: ${props => props.theme.inputBg};
  margin-bottom: 4px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
`;

const RollLabel = styled.span`
  font-weight: 500;
`;

const RollValue = styled.span`
  font-weight: bold;
  color: ${props => props.theme.borderAccent};
`;
