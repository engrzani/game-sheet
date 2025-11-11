import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';

export default function Attacks({ state, updateState, performRoll }) {
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
    performRoll(name, heavy ? 2 : 1, 0);
  };

  return (
    <Section>
      <h3>Common Attacks</h3>
      {['Melee', 'Ranged', 'Ether'].map(type => (
        <div key={type} style={{ marginBottom: '8px' }}>
          <button onClick={() => attack(`${type}Light`, false)}>
            {type} Light (2 AP, 1d6)
          </button>
          <button onClick={() => attack(`${type}Heavy`, true)}>
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