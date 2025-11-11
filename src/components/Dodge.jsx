// src/components/Dodge.jsx
import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';

export default function Dodge({ state, updateState, rollDice }) {
  const d = state.dodge;
  const bonus = d.base + d.mods;

  const adj = (field, delta) => {
    const newVal = Math.max(0, d[field] + delta);
    updateState('dodge', { ...d, [field]: newVal });
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
    <Section>
      <h3>Dodge ({d.diceCount}d6 + {bonus})</h3>

      <div>
        Base: {d.base} <Btn onClick={() => adj('base', 1)}>+</Btn><Btn onClick={() => adj('base', -1)}>-</Btn>
      </div>

      <div>
        Mods: {d.mods} <Btn onClick={() => adj('mods', 1)}>+</Btn><Btn onClick={() => adj('mods', -1)}>-</Btn>
      </div>

      <div>
        Dice: {d.diceCount} <Btn onClick={() => adj('diceCount', 1)}>+</Btn><Btn onClick={() => adj('diceCount', -1)}>-</Btn>
      </div>

      {d.lastRolls && d.lastRolls.length > 0 && (
        <div>
          Dice: {d.lastRolls.join(' + ')} = {d.lastRolls.reduce((a, b) => a + b, 0)}
        </div>
      )}

      {d.rollResult > 0 && <div><strong>Result: {d.rollResult}</strong></div>}

      <button onClick={roll}>Roll Dodge</button>
    </Section>
  );
}