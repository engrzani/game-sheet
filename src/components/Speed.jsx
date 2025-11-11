import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';

export default function Speed({ state, updateState }) {
  const sp = state.speed;
  const total = sp.base + sp.mods;
  const half = Math.floor(total / 2);

  const adj = (field, delta) =>
    updateState('speed', { ...sp, [field]: Math.max(0, sp[field] + delta) });

  return (
    <Section>
      <h3>Speed</h3>
      <div>Total: {total}</div>
      <div>Half (rough): {half}</div>
      <div>
        Base: {sp.base}{' '}
        <Btn onClick={() => adj('base', 1)}>+</Btn>
        <Btn onClick={() => adj('base', -1)}>-</Btn>
      </div>
      <div>
        Mods: {sp.mods}{' '}
        <Btn onClick={() => adj('mods', 1)}>+</Btn>
        <Btn onClick={() => adj('mods', -1)}>-</Btn>
      </div>
    </Section>
  );
}