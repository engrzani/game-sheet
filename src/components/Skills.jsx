import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';

export default function Skills({ state, updateState, rollDice }) {
  const s = state.skills;

  const toggleDubs = () => updateState('skills', { ...s, dubs: !s.dubs });

  const rollSkill = idx => {
    const skill = s.list[idx];
    const bonus = skill.base + skill.mods;
    const r1 = rollDice(6, 1).total;
    let final = r1 + bonus;
    // In Skills rollSkill()
let display = r1;
if (s.dubs) {
  const r2 = rollDice(6,1).total;
  display = `${r1} / ${r2}`;
  final = Math.max(r1, r2) + bonus;
}
    const newList = s.list.map((it, i) =>
      i === idx ? { ...it, rollResult: final } : it
    );
    updateState('skills', { ...s, list: newList });
  };

  const adj = (idx, field, delta) => {
    const newList = s.list.map((it, i) =>
      i === idx ? { ...it, [field]: Math.max(0, it[field] + delta) } : it
    );
    updateState('skills', { ...s, list: newList });
  };

  return (
    <Section>
      <h3>Skills</h3>
      <label>
        <input type="checkbox" checked={s.dubs} onChange={toggleDubs} />
        Dubs (roll twice, pick max)
      </label>

      {s.list.map((sk, i) => (
        <div key={sk.name} style={{ marginTop: '8px' }}>
          <strong>{sk.name}</strong> (+{sk.base + sk.mods})
          <Btn onClick={() => adj(i, 'base', 1)}>+</Btn>
          <Btn onClick={() => adj(i, 'base', -1)}>-</Btn>
          <Btn onClick={() => adj(i, 'mods', 1)}>+</Btn>
          <Btn onClick={() => adj(i, 'mods', -1)}>-</Btn>
          {' '}
          <button onClick={() => rollSkill(i)}>Roll</button>
          {sk.rollResult > 0 && <strong> → {sk.rollResult}</strong>}
        </div>
      ))}
    </Section>
  );
}