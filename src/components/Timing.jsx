import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';

export default function Timing({ state, updateState, rollDice }) {
  const t = state.timing;
  const bonus = t.base + t.mods;

  const roll = () => {
    const { total } = rollDice(6, 1);
    updateState('timing', { ...t, rollResult: total + bonus });
  };

  const adj = (field, delta) =>
    updateState('timing', { ...t, [field]: Math.max(0, t[field] + delta) });

  return (
    <Section>
      <h3>Timing (1d6 + {bonus})</h3>
      <div>
        Base: {t.base}{' '}
        <Btn onClick={() => adj('base', 1)}>+</Btn>
        <Btn onClick={() => adj('base', -1)}>-</Btn>
      </div>
      <div>
        Mods: {t.mods}{' '}
        <Btn onClick={() => adj('mods', 1)}>+</Btn>
        <Btn onClick={() => adj('mods', -1)}>-</Btn>
      </div>
      <button onClick={roll}>Roll Timing</button>
      {t.rollResult > 0 && <div><strong>Result: {t.rollResult}</strong></div>}
    </Section>
  );
}