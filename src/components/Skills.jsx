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
    <Section theme={theme}>
      <h3>Skillsaves</h3>
      <CompactGrid>
        {s.list.map((skill, i) => (
          <CompactSkill key={skill.name} theme={theme}>
            <SkillName theme={theme}>{skill.name}</SkillName>
            <CompactRow>
              <SmallLabel>Base</SmallLabel>
              <SmallBox theme={theme}>{skill.base}</SmallBox>
              <SmallBtn theme={theme} onClick={() => adjust(i, 'base', 1)}>+</SmallBtn>
              <SmallBtn theme={theme} onClick={() => adjust(i, 'base', -1)}>-</SmallBtn>
            </CompactRow>
            <CompactRow>
              <SmallLabel>Mods</SmallLabel>
              <SmallBox theme={theme}>{skill.mods}</SmallBox>
              <SmallBtn theme={theme} onClick={() => adjust(i, 'mods', 1)}>+</SmallBtn>
              <SmallBtn theme={theme} onClick={() => adjust(i, 'mods', -1)}>-</SmallBtn>
            </CompactRow>
            <CompactRow>
              <SmallLabel>Total</SmallLabel>
              <SmallBox theme={theme} $bold>{skill.base + skill.mods}</SmallBox>
            </CompactRow>
            <CompactControls>
              <CompactDubs theme={theme}>
                <input type="checkbox" checked={skill.dubs} onChange={() => toggleDubs(i)} />
                <span>Dubs</span>
              </CompactDubs>
              <CompactRollBtn theme={theme} onClick={() => rollSkill(i)}>ROLL</CompactRollBtn>
            </CompactControls>
            {skill.rollResult > 0 && (
              <CompactResult theme={theme}>{skill.rollResult} {skill.lastRoll && `(${skill.lastRoll})`}</CompactResult>
            )}
          </CompactSkill>
        ))}
      </CompactGrid>
    </Section>
  );
}

const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 8px;
  margin-top: 8px;
`;

const CompactSkill = styled.div`
  padding: 8px;
  background: ${props => props.theme.sectionBg};
  border-radius: 6px;
  border: 1px solid ${props => props.theme.border};
  font-size: 12px;
`;

const SkillName = styled.div`
  font-weight: bold;
  text-align: center;
  margin-bottom: 6px;
  color: ${props => props.theme.borderAccent};
  font-size: 11px;
`;

const CompactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 3px;
`;

const SmallLabel = styled.span`
  min-width: 26px;
  font-size: 10px;
  color: ${props => props.theme?.text || '#000'};
`;

const SmallBox = styled.div`
  min-width: 18px;
  text-align: center;
  padding: 1px 4px;
  background: ${props => props.theme.inputBg};
  border-radius: 3px;
  border: 1px solid ${props => props.theme.border};
  font-weight: ${p => p.$bold ? 'bold' : 'normal'};
  color: ${props => props.theme.text};
  font-size: 10px;
`;

const SmallBtn = styled.button`
  background: ${props => props.theme.button};
  color: ${props => props.theme.buttonText};
  border: none;
  padding: 1px 4px;
  border-radius: 2px;
  cursor: pointer;
  font-size: 9px;
  font-weight: bold;
  min-width: 14px;
  height: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.buttonHover};
    transform: scale(1.1);
  }
`;

const CompactControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`;

const CompactDubs = styled.label`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 9px;
  color: ${props => props.theme.text};
  
  input {
    accent-color: ${props => props.theme.borderAccent};
    transform: scale(0.8);
  }
`;

const CompactRollBtn = styled.button`
  background: ${props => props.theme.button};
  color: ${props => props.theme.buttonText};
  border: none;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
  cursor: pointer;
  font-size: 9px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.buttonHover};
    transform: scale(1.05);
  }
`;

const CompactResult = styled.div`
  margin-top: 4px;
  padding: 3px;
  background: ${props => props.theme.borderAccent}22;
  border: 1px solid ${props => props.theme.borderAccent};
  border-radius: 3px;
  text-align: center;
  font-size: 10px;
  font-weight: bold;
  color: ${props => props.theme.text};
`;