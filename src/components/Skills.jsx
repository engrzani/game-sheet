// src/components/Skills.jsx
import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';

export default function Skills({ state, updateState, rollDice }) {
  const { theme } = useTheme();
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
    <Section theme={theme}>
      <h3>Skill Saves</h3>
      <Grid theme={theme}>
        {s.list.map((skill, i) => (
          <SkillBox key={skill.name} theme={theme}>
            <Name theme={theme}>{skill.name}</Name>

            <Row>
              <Label>Base:</Label>
              <Value theme={theme}>{skill.base}</Value>
              <Btn theme={theme} onClick={() => adjust(i, 'base', 1)}>+</Btn>
              <Btn theme={theme} onClick={() => adjust(i, 'base', -1)}>-</Btn>
            </Row>

            <Row>
              <Label>Mods:</Label>
              <Value theme={theme}>{skill.mods}</Value>
              <Btn theme={theme} onClick={() => adjust(i, 'mods', 1)}>+</Btn>
              <Btn theme={theme} onClick={() => adjust(i, 'mods', -1)}>-</Btn>
            </Row>

            <Row>
              <Label>Total:</Label>
              <Value theme={theme} strong>{skill.base + skill.mods}</Value>
            </Row>

            <Row>
              <Dubs theme={theme}>
                <input
                  type="checkbox"
                  checked={skill.dubs}
                  onChange={() => toggleDubs(i)}
                  id={`dubs-${i}`}
                />
                <label htmlFor={`dubs-${i}`}>Dubs</label>
              </Dubs>
              <RollBtn theme={theme} onClick={() => rollSkill(i)}>ROLL</RollBtn>
            </Row>

            {skill.rollResult > 0 && (
              <Result theme={theme}>
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
  background: ${props => props.theme.sectionBg};
  padding: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
`;

const Name = styled.div`
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: ${props => props.theme.borderAccent};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
`;

const Label = styled.span` 
  min-width: 50px; 
  font-size: 14px; 
  color: ${props => props.theme.text};
`;

const Value = styled.div`
  min-width: 30px;
  text-align: center;
  padding: 2px 6px;
  background: ${props => props.theme.inputBg};
  border-radius: 4px;
  font-weight: ${p => p.strong ? 'bold' : 'normal'};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
`;

const Dubs = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  input { accent-color: ${props => props.theme.borderAccent}; }
  label { 
    font-size: 13px; 
    cursor: pointer; 
    color: ${props => props.theme.text};
  }
`;

const RollBtn = styled.button`
  background: ${props => props.theme.button};
  color: ${props => props.theme.buttonText};
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { 
    background: ${props => props.theme.buttonHover}; 
    transform: scale(1.05);
  }
`;

const Result = styled.div`
  margin-top: 8px;
  padding: 6px;
  background: ${props => props.theme.borderAccent}22;
  border: 1px solid ${props => props.theme.borderAccent};
  border-radius: 4px;
  text-align: center;
  font-size: 15px;
  color: ${props => props.theme.text};
  small { opacity: 0.8; }
`;