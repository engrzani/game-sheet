// src/components/Skills.jsx
import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';

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
      display = `${r1.rolls[0]} / ${r2.rolls[0]}`;
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
          <SkillBox key={skill.name}>
            <Name>{skill.name}</Name>

            <Row>
              <Label>Base:</Label>
              <Value>{skill.base}</Value>
              <Btn onClick={() => adjust(i, 'base', 1)}>+</Btn>
              <Btn onClick={() => adjust(i, 'base', -1)}>-</Btn>
            </Row>

            <Row>
              <Label>Mods:</Label>
              <Value>{skill.mods}</Value>
              <Btn onClick={() => adjust(i, 'mods', 1)}>+</Btn>
              <Btn onClick={() => adjust(i, 'mods', -1)}>-</Btn>
            </Row>

            <Row>
              <Label>Total:</Label>
              <Value strong>{skill.base + skill.mods}</Value>
            </Row>

            <Row>
              <Dubs>
                <input
                  type="checkbox"
                  checked={skill.dubs}
                  onChange={() => toggleDubs(i)}
                  id={`dubs-${i}`}
                />
                <label htmlFor={`dubs-${i}`}>Dubs</label>
              </Dubs>
              <RollBtn onClick={() => rollSkill(i)}>ROLL</RollBtn>
            </Row>

            {skill.rollResult > 0 && (
              <Result>
                <strong>{skill.rollResult}</strong>
                {skill.lastRoll && <small> ({skill.lastRoll})</small>}
              </Result>
            )}
          </SkillBox>
        ))}
      </Grid>
    </Section>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 10px;
`;

const SkillBox = styled.div`
  background: ${props => props.theme.card};
  padding: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const Name = styled.div`
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: ${props => props.theme.accent};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
`;

const Label = styled.span` min-width: 50px; font-size: 14px; `;
const Value = styled.div`
  min-width: 30px;
  text-align: center;
  padding: 2px 6px;
  background: ${props => props.theme.inputBg};
  border-radius: 4px;
  font-weight: ${p => p.strong ? 'bold' : 'normal'};
  border: 1px solid ${props => props.theme.border};
`;

const Dubs = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  input { accent-color: ${props => props.theme.accent}; }
  label { font-size: 13px; cursor: pointer; }
`;

const RollBtn = styled.button`
  background: ${props => props.theme.accent};
  color: #000;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover { background: ${props => props.theme.accentHover}; }
`;

const Result = styled.div`
  margin-top: 8px;
  padding: 6px;
  background: ${props => props.theme.success};
  border-radius: 4px;
  text-align: center;
  font-size: 15px;
  small { opacity: 0.8; }
`;