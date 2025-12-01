// src/components/Skills.jsx
import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';

export default function Skills({ state, updateState, rollDice }) {
  const { theme } = useTheme();
  const s = state.skills;

  const rollSkill = (idx) => {
    const skill = s.list[idx];
    const bonus = skill.base + skill.mods;
    const diceCount = skill.dice || 1;
    
    const r1 = rollDice(6, diceCount);
    let finalRoll = r1.total;
    let display = r1.rolls.join(', ') + ` + ${bonus}`;

    if (skill.dubs) {
      const r2 = rollDice(6, diceCount);
      // Combine both sets and choose best N dice
      const allDice = [...r1.rolls, ...r2.rolls];
      const sorted = [...allDice].sort((a, b) => b - a);
      const bestDice = sorted.slice(0, diceCount);
      finalRoll = bestDice.reduce((sum, val) => sum + val, 0);
      // Display: best dice / other dice
      const otherDice = sorted.slice(diceCount);
      display = bestDice.join(', ') + ' / ' + otherDice.join(', ') + ` + ${bonus}`;
    }
    
    const final = finalRoll + bonus;

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
    const newList = s.list.map((sk, i) => {
      if (i !== idx) return sk;
      let newValue = sk[field] + delta;
      if (field === 'dice') {
        newValue = Math.max(1, Math.min(10, newValue)); // Dice between 1-10
      } else {
        newValue = Math.max(0, newValue);
      }
      return { ...sk, [field]: newValue };
    });
    updateState('skills', { ...s, list: newList });
  };

  return (
    <Section theme={theme}>
      <h3>Skillsaves</h3>
      <Grid>
        {s.list.map((skill, i) => (
          <Skill key={skill.name} theme={theme}>
            <Name theme={theme}>{skill.name}</Name>
            <Row>
              <Label>Dice</Label>
              <Box theme={theme}>{skill.dice || 1}</Box>
              <SmallBtn theme={theme} onClick={() => adjust(i, 'dice', 1)}>+</SmallBtn>
              <SmallBtn theme={theme} onClick={() => adjust(i, 'dice', -1)}>-</SmallBtn>
            </Row>
            <Row>
              <Label>Base</Label>
              <Box theme={theme}>{skill.base}</Box>
              <SmallBtn theme={theme} onClick={() => adjust(i, 'base', 1)}>+</SmallBtn>
              <SmallBtn theme={theme} onClick={() => adjust(i, 'base', -1)}>-</SmallBtn>
            </Row>
            <Row>
              <Label>Mods</Label>
              <Box theme={theme}>{skill.mods}</Box>
              <SmallBtn theme={theme} onClick={() => adjust(i, 'mods', 1)}>+</SmallBtn>
              <SmallBtn theme={theme} onClick={() => adjust(i, 'mods', -1)}>-</SmallBtn>
            </Row>
            <Row>
              <Label>Total</Label>
              <Box theme={theme} bold>{skill.base + skill.mods}</Box>
            </Row>
            <Controls>
              <Dubs theme={theme}>
                <input type="checkbox" checked={skill.dubs} onChange={() => toggleDubs(i)} />
                <span>Dubs/Nubs</span>
              </Dubs>
              <RollBtn theme={theme} onClick={() => rollSkill(i)}>ROLL</RollBtn>
            </Controls>
            {skill.rollResult > 0 && (
              <Result theme={theme}>
                Result: {skill.rollResult} ({skill.lastRoll})
              </Result>
            )}
          </Skill>
        ))}
      </Grid>
    </Section>
  );
}

const Section = styled.div`
  background: ${p => p.theme.sectionBg};
  color: ${p => p.theme.text};
  padding: 8px;
  margin: 8px 0;
  border-radius: 6px;
  border-left: 3px solid ${p => p.theme.sectionBorderYellow};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const Skill = styled.div`
  padding: 8px;
  background: ${p => p.theme.inputBg};
  border-radius: 4px;
  border: 1px solid ${p => p.theme.border};
  font-size: 13px;
`;

const Name = styled.div`
  font-weight: bold;
  text-align: center;
  margin-bottom: 4px;
  color: ${p => p.theme.borderAccent};
  font-size: 12px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 2px;
`;

const Label = styled.span`
  min-width: 32px;
  font-size: 12px;
  font-weight: normal;
`;

const Box = styled.div`
  min-width: 20px;
  text-align: center;
  padding: 2px 4px;
  background: ${p => p.theme.sectionBg};
  border-radius: 2px;
  border: 1px solid ${p => p.theme.border};
  font-weight: ${p => p.bold ? 'bold' : 'normal'};
  font-size: 12px;
`;

const SmallBtn = styled.button`
  background: ${p => p.theme.button};
  color: ${p => p.theme.buttonText};
  border: none;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  font-weight: bold;
  font-size: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${p => p.theme.buttonHover};
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3px;
  align-items: center;
`;

const Dubs = styled.label`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 9px;
  color: ${p => p.theme.text};
  cursor: pointer;
  
  input {
    accent-color: ${p => p.theme.borderAccent};
    width: 10px;
    height: 10px;
    cursor: pointer;
  }
`;

const RollBtn = styled.button`
  background: ${p => p.theme.button};
  color: ${p => p.theme.buttonText};
  border: none;
  padding: 3px 8px;
  border-radius: 2px;
  font-weight: bold;
  cursor: pointer;
  font-size: 9px;
  
  &:hover {
    background: ${p => p.theme.buttonHover};
  }
`;

const Result = styled.div`
  margin-top: 4px;
  padding: 3px;
  background: ${p => p.theme.borderAccent}22;
  border-radius: 2px;
  text-align: center;
  font-size: 10px;
  font-weight: bold;
  border: 1px solid ${p => p.theme.borderAccent};
`;