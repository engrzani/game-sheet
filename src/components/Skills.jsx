// src/components/Skills.jsx
import styled from 'styled-components';
import { BtnSmall, Section } from './SharedStyles';

export default function Skills({ state, updateState, rollDice }) {
  const s = state.skills;

  const rollSkill = (idx) => {
    const skill = s.list[idx];
    const bonus = skill.base + skill.mods;
    const r1 = rollDice(6, 1);
    let final = r1.total + bonus;
    let display = `${r1.rolls[0]}`;

    if (skill.dubs) {
      const r2 = rollDice(6, 1);
      display = `${r1.rolls[0]}/${r2.rolls[0]}`;
      final = Math.max(r1.total, r2.total) + bonus;
    }

    const newList = s.list.map((sk, i) =>
      i === idx ? { ...sk, rollResult: final, lastRoll: display } : sk
    );
    updateState('skills', { ...s, list: newList });
  };

  const toggleDubs = (idx) => {
    const newList = s.list.map((sk, i) =>
      i === idx ? { ...sk, dubs: !sk.dubs } : sk
    );
    updateState('skills', { ...s, list: newList });
  };

  const adjust = (idx, field, delta) => {
    const newList = s.list.map((sk, i) =>
      i === idx ? { ...sk, [field]: Math.max(0, sk[field] + delta) } : sk
    );
    updateState('skills', { ...s, list: newList });
  };

  return (
    <Section>
      <h3>Skill Saves</h3>
      <Grid>
        {s.list.map((skill, i) => (
          <Skill key={skill.name}>
            <Name>{skill.name}</Name>
            <Row>
              <Label>Base</Label>
              <Box>{skill.base}</Box>
              <BtnSmall onClick={() => adjust(i, 'base', 1)}>+</BtnSmall>
              <BtnSmall onClick={() => adjust(i, 'base', -1)}>-</BtnSmall>
            </Row>
            <Row>
              <Label>Mods</Label>
              <Box>{skill.mods}</Box>
              <BtnSmall onClick={() => adjust(i, 'mods', 1)}>+</BtnSmall>
              <BtnSmall onClick={() => adjust(i, 'mods', -1)}>-</BtnSmall>
            </Row>
            <Row>
              <Label>Total</Label>
              <Box bold>{skill.base + skill.mods}</Box>
            </Row>
            <Controls>
              <Dubs>
                <input type="checkbox" checked={skill.dubs} onChange={() => toggleDubs(i)} />
                <span>Dubs</span>
              </Dubs>
              <RollBtn onClick={() => rollSkill(i)}>ROLL</RollBtn>
            </Controls>
            {skill.rollResult > 0 && (
              <Result>{skill.rollResult} {skill.lastRoll && `(${skill.lastRoll})`}</Result>
            )}
          </Skill>
        ))}
      </Grid>
    </Section>
  );
}

const Grid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; `;
const Skill = styled.div` padding: 12px; background: var(--card); border-radius: 8px; border: 1px solid var(--border); `;
const Name = styled.div` font-weight: bold; text-align: center; margin-bottom: 8px; color: var(--accent); `;
const Row = styled.div` display: flex; align-items: center; gap: 4px; margin-bottom: 4px; `;
const Label = styled.span` min-width: 36px; font-size: 13px; `;
const Box = styled.div` min-width: 24px; text-align: center; padding: 2px 6px; background: var(--inputBg); border-radius: 4px; border: 1px solid var(--border); font-weight: ${p => p.bold ? 'bold' : 'normal'}; `;
const Controls = styled.div` display: flex; justify-content: space-between; margin-top: 6px; `;
const Dubs = styled.label` display: flex; align-items: center; gap: 4px; font-size: 13px; input { accent-color: var(--accent); } `;
const RollBtn = styled.button` background: var(--accent); color: #000; border: none; padding: 4px 10px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px; &:hover { background: var(--accentHover); } `;
const Result = styled.div` margin-top: 6px; padding: 6px; background: var(--success); border-radius: 4px; text-align: center; font-size: 14px; font-weight: bold; `;