// src/components/Dodge.jsx
import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';

export default function Dodge({ state, updateState, rollDice }) {
  const { theme } = useTheme();
  const d = state.dodge;
  const bonus = d.base + d.mods;
  
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
    const result = rollDice(6, d.diceCount);
    const total = result.total + bonus;
    updateState('dodge', {
      ...d,
      rollResult: total,
      lastRolls: result.rolls
    });
  };

  return (
    <Section theme={theme}>
      <h3>Dodge ({d.diceCount}d6 + {bonus})</h3>

      <div>
        Base: {d.base} <Btn theme={theme} onClick={() => adj('base', 1)}>+</Btn><Btn theme={theme} onClick={() => adj('base', -1)}>-</Btn>
      </div>

      <div>
        Mods: {d.mods} <Btn theme={theme} onClick={() => adj('mods', 1)}>+</Btn><Btn theme={theme} onClick={() => adj('mods', -1)}>-</Btn>
      </div>

      <div>
        Dice: {d.diceCount} <Btn theme={theme} onClick={() => adj('diceCount', 1)}>+</Btn><Btn theme={theme} onClick={() => adj('diceCount', -1)}>-</Btn>
      </div>

      {d.lastRolls && d.lastRolls.length > 0 && (
        <div>
          Dice: {d.lastRolls.join(' + ')} = {d.lastRolls.reduce((a, b) => a + b, 0)}
        </div>
      )}

      {d.rollResult > 0 && <div><strong>Result: {d.rollResult}</strong></div>}

      <button 
        onClick={roll}
        style={{
          background: theme.button,
          color: theme.buttonText,
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '8px'
        }}
      >
        Roll Dodge
      </button>
    </Section>
  );
}