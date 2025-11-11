import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';

export default function Defense({ state, updateState }) {
  const d = state.defense;

  const setPhysical = delta =>
    updateState('defense', { ...d, physical: Math.max(0, d.physical + delta) });

  const setNon = (type, delta) => {
    const newVal = Math.max(0, (d.nonPhysical[type] || 0) + delta);
    updateState('defense', {
      ...d,
      nonPhysical: { ...d.nonPhysical, [type]: newVal }
    });
  };

  const addType = () => {
    const t = prompt('New damage type (e.g. Poison):');
    if (t) setNon(t.toLowerCase(), 0);
  };

  return (
    <Section>
      <h3>Defense</h3>
      <div>
        Physical: {d.physical}{' '}
        <Btn onClick={() => setPhysical(1)}>+</Btn>
        <Btn onClick={() => setPhysical(-1)}>-</Btn>
      </div>

      <h4>Non-Physical</h4>
      {Object.entries(d.nonPhysical).map(([type, val]) => (
        <div key={type}>
          {type}: {val}{' '}
          <Btn onClick={() => setNon(type, 1)}>+</Btn>
          <Btn onClick={() => setNon(type, -1)}>-</Btn>
        </div>
      ))}
      <button onClick={addType}>+ Add New Type</button>

      <h4>Other Effects</h4>
      <textarea
        rows={2}
        value={d.otherEffects}
        onChange={e => updateState('defense', { ...d, otherEffects: e.target.value })}
        placeholder="e.g. Immune to Fire"
      />
    </Section>
  );
}