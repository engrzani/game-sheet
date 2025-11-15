import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';

export default function Attacks({ state, updateState, rollDice, performRoll }) {
  const { theme } = useTheme();
  const attacks = state.attacks || {};
  const ap = state.actionPoints;

  const spend = cost => {
    if (ap.current < cost) {
      alert('Not enough AP!');
      return false;
    }
    updateState('actionPoints', { ...ap, current: ap.current - cost });
    return true;
  };

  const attack = (name, heavy) => {
    const cost = heavy ? 3 : 2;
    if (!spend(cost)) return;
    if (performRoll) {
      performRoll(name, heavy ? 2 : 1, 0);
    }
  };

  const rollAttack = (attackKey) => {
    const attackData = attacks[attackKey];
    if (!attackData) return;
    
    if (ap.current < attackData.apCost) {
      alert('Not enough AP!');
      return;
    }
    
    updateState('actionPoints', { ...ap, current: ap.current - attackData.apCost });
    
    if (rollDice) {
      const res = rollDice(6, attackData.dice);
      const total = res.total + attackData.base + attackData.mods;
      
      updateState('attacks', {
        ...attacks,
        [attackKey]: { ...attackData, rollResult: total }
      });
    }
  };

  const adjustAttack = (attackKey, field, delta) => {
    const attackData = attacks[attackKey];
    if (!attackData) return;
    
    updateState('attacks', {
      ...attacks,
      [attackKey]: {
        ...attackData,
        [field]: Math.max(0, attackData[field] + delta)
      }
    });
  };

  return (
    <Section theme={theme}>
      <h3>Attacks</h3>
      
      {Object.entries(attacks).map(([key, attack]) => (
        <div key={key} style={{ marginBottom: '12px', padding: '8px', border: `1px solid ${theme.border}`, borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 8px 0', textTransform: 'capitalize' }}>
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span>Dice: {attack.dice}</span>
            <Btn theme={theme} onClick={() => adjustAttack(key, 'dice', 1)}>+</Btn>
            <Btn theme={theme} onClick={() => adjustAttack(key, 'dice', -1)}>-</Btn>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span>Base: {attack.base}</span>
            <Btn theme={theme} onClick={() => adjustAttack(key, 'base', 1)}>+</Btn>
            <Btn theme={theme} onClick={() => adjustAttack(key, 'base', -1)}>-</Btn>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span>Mods: {attack.mods}</span>
            <Btn theme={theme} onClick={() => adjustAttack(key, 'mods', 1)}>+</Btn>
            <Btn theme={theme} onClick={() => adjustAttack(key, 'mods', -1)}>-</Btn>
          </div>
          
          <button 
            onClick={() => rollAttack(key)}
            style={{
              background: theme.button,
              color: theme.buttonText,
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ROLL ({attack.apCost} AP)
          </button>
          
          {attack.rollResult > 0 && (
            <div style={{ 
              marginTop: '8px', 
              padding: '4px 8px', 
              background: theme.borderAccent + '22', 
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              Result: {attack.rollResult}
            </div>
          )}
        </div>
      ))}

      <h4>Quick Attacks</h4>
      {['Melee', 'Ranged', 'Ether'].map(type => (
        <div key={type} style={{ marginBottom: '8px' }}>
          <button 
            onClick={() => attack(`${type}Light`, false)}
            style={{
              background: theme.button,
              color: theme.buttonText,
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            {type} Light (2 AP, 1d6)
          </button>
          <button 
            onClick={() => attack(`${type}Heavy`, true)}
            style={{
              background: theme.button,
              color: theme.buttonText,
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {type} Heavy (3 AP, 2d6)
          </button>
        </div>
      ))}

      <h4>Last Rolls</h4>
      {Object.entries(state.lastRolls).map(([k, v]) => (
        <div key={k}>{k}: <strong>{v}</strong></div>
      ))}
    </Section>
  );
}