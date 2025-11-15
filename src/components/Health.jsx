// src/components/Health.jsx
import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';

export default function Health({ state, updateState }) {
  const { theme } = useTheme();
  const h = state.health;
  const max = h.base + h.equip + h.mods;

  const adj = (field, delta) => {
    updateState('health', {
      ...h,
      [field]: Math.max(0, h[field] + delta)
    });
  };

  return (
    <Section theme={theme}>
      <h3>Health</h3>
      <HealthDisplay theme={theme}>
        <strong>Max: {max}</strong>
      </HealthDisplay>

      <StatRow theme={theme}>
        <label>Current:</label>
        <span>{h.current}</span>
        <ButtonGroup>
          <Btn theme={theme} onClick={() => adj('current', 1)}>+</Btn>
          <Btn theme={theme} onClick={() => adj('current', -1)}>-</Btn>
        </ButtonGroup>
      </StatRow>

      <StatRow theme={theme}>
        <label>Temp:</label>
        <span>{h.temp}</span>
        <ButtonGroup>
          <Btn theme={theme} onClick={() => adj('temp', 1)}>+</Btn>
          <Btn theme={theme} onClick={() => adj('temp', -1)}>-</Btn>
        </ButtonGroup>
      </StatRow>

      <StatRow theme={theme}>
        <label>Base:</label>
        <span>{h.base}</span>
        <ButtonGroup>
          <Btn theme={theme} onClick={() => adj('base', 1)}>+</Btn>
          <Btn theme={theme} onClick={() => adj('base', -1)}>-</Btn>
        </ButtonGroup>
      </StatRow>

      <StatRow theme={theme}>
        <label>Equip:</label>
        <span>{h.equip}</span>
        <ButtonGroup>
          <Btn theme={theme} onClick={() => adj('equip', 1)}>+</Btn>
          <Btn theme={theme} onClick={() => adj('equip', -1)}>-</Btn>
        </ButtonGroup>
      </StatRow>

      <StatRow theme={theme}>
        <label>Mods:</label>
        <span>{h.mods}</span>
        <ButtonGroup>
          <Btn theme={theme} onClick={() => adj('mods', 1)}>+</Btn>
          <Btn theme={theme} onClick={() => adj('mods', -1)}>-</Btn>
        </ButtonGroup>
      </StatRow>
    </Section>
  );
}

const HealthDisplay = styled.div`
  color: ${props => props.theme.text};
  margin-bottom: 12px;
  font-size: 16px;
`;
const HealthInput = ({ label, value, onChange, step = 1 }) => (
  <InputRow>
    <label>{label}</label>
    <InputBox
      type="number"
      value={value}
      onChange={onChange}
      onClick={e => e.target.select()}
    />
    <BtnSmall onClick={() => onChange({ target: { value: value + step } })}>+</BtnSmall>
    <BtnSmall onClick={() => onChange({ target: { value: value - step } })}>-</BtnSmall>
  </InputRow>
);

const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
  padding: 4px 0;
  
  label {
    color: ${props => props.theme.text};
    font-weight: 500;
    min-width: 60px;
  }
  
  span {
    color: ${props => props.theme.textSecondary};
    font-weight: bold;
    min-width: 30px;
    text-align: center;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 2px;
`;