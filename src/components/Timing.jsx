import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';

export default function Timing({ state, updateState, rollDice }) {
  const { theme } = useTheme();
  const t = state.timing;
  const bonus = t.base + t.mods;
  const diceCount = t.dice || 1;

  const roll = () => {
    const r1 = rollDice(6, diceCount);
    let finalRoll = r1.total;
    let displayRolls = r1.rolls;
    
    if (t.dubs) {
      const r2 = rollDice(6, diceCount);
      // Combine both sets and choose best N dice
      const allDice = [...r1.rolls, ...r2.rolls];
      const sorted = [...allDice].sort((a, b) => b - a);
      const bestDice = sorted.slice(0, diceCount);
      finalRoll = bestDice.reduce((sum, val) => sum + val, 0);
      // Display: best dice / other dice
      const otherDice = sorted.slice(diceCount);
      displayRolls = [...bestDice, '/', ...otherDice];
    }
    
    const finalResult = finalRoll + bonus;
    
    updateState('timing', { 
      ...t, 
      rollResult: finalResult,
      lastRoll: { displayRolls, bonus }
    });
  };

  const adj = (field, delta) => {
    if (field === 'dice') {
      const newValue = Math.max(1, Math.min(10, t[field] + delta));
      updateState('timing', { ...t, [field]: newValue });
    } else {
      updateState('timing', { ...t, [field]: Math.max(0, t[field] + delta) });
    }
  };

  const toggleDubs = () =>
    updateState('timing', { ...t, dubs: !t.dubs });

  return (
    <Section theme={theme} style={{ borderLeftColor: theme.sectionBorderYellow }}>
      <h3>Timing ({diceCount}d6 + {bonus})</h3>
      <div style={{ fontSize: '15px', marginBottom: '6px' }}>
        Dice: {diceCount}{' '}
        <Btn onClick={() => adj('dice', 1)}>+</Btn>
        <Btn onClick={() => adj('dice', -1)}>-</Btn>
      </div>
      <div style={{ fontSize: '15px', marginBottom: '6px' }}>
        Base: {t.base}{' '}
        <Btn onClick={() => adj('base', 1)}>+</Btn>
        <Btn onClick={() => adj('base', -1)}>-</Btn>
      </div>
      <div style={{ fontSize: '15px', marginBottom: '6px' }}>
        Mods: {t.mods}{' '}
        <Btn onClick={() => adj('mods', 1)}>+</Btn>
        <Btn onClick={() => adj('mods', -1)}>-</Btn>
      </div>
      <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' }}>
        Total Bonus: +{bonus}
      </div>
      <div style={{ margin: '8px 0' }}>
        <label style={{ fontSize: '13px', cursor: 'pointer', fontWeight: 'normal' }}>
          <input
            type="checkbox"
            checked={t.dubs}
            onChange={toggleDubs}
            style={{ marginRight: '6px', width: '14px', height: '14px', cursor: 'pointer' }}
          />
          Dubs/Nubs
        </label>
      </div>
      <Btn onClick={roll}>Roll Timing</Btn>
      {t.rollResult > 0 && t.lastRoll && (
        <div style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '8px', padding: '6px', background: 'rgba(255,215,0,0.1)', borderRadius: '4px', border: '1px solid #ffd700' }}>
          Result: {t.rollResult} ({t.lastRoll.displayRolls?.map(r => r === '/' ? ' / ' : r).join(', ').replace(', / ,', ' /') || 0} + {t.lastRoll.bonus})
        </div>
      )}
      <div style={{fontSize: '13px', color: '#888', marginTop: '6px'}}>
        {t.rollResult === 0 ? 'Click "Roll Timing" to get your Timing score/Turn Order' : 'Timing rolled!'}
      </div>
    </Section>
  );
}