import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';

export default function Attacks({ state, updateState, performRoll }) {
  const ap = state.actionPoints;

  const spend = cost => {
    if (ap.current < cost) {
      alert('Not enough AP!');
      return false;
    }
    updateState('actionPoints', { ...ap, current: ap.current - cost });
    return true;
  };

  const attack = (name, heavy) => {
    const cost = heavy ? 3 : 2;
    if (!spend(cost)) return;
    performRoll(name, heavy ? 2 : 1, 0);
  };
const AttackRow = ({ name, attack }) => {
  const total = attack.dice + attack.base + attack.mods;
  const roll = () => {
    if (state.actionPoints.current < attack.apCost) return;
    updateState('actionPoints', { ...state.actionPoints, current: state.actionPoints.current - attack.apCost });
    const res = rollDice(6, attack.dice);
    updateState('attacks', { ...state.attacks, [name]: { ...attack, rollResult: res.total + attack.base + attack.mods } });
  };

  return (
    <Attack>
      <Name>{name.replace(/([A-Z])/g, ' $1').trim()}</Name>
      <Row>
        <Label>Dice</Label>
        <Box>{attack.dice}</Box>
        <BtnSmall onClick={() => adj(name, 'dice', 1)}>+</BtnSmall>
        <BtnSmall onClick={() => adj(name, 'dice', -1)}>-</BtnSmall>
      </Row>
      {/* Base, Mods, AP Cost */}
      <RollBtn onClick={roll}>ROLL</RollBtn>
      {attack.rollResult > 0 && <Result>{attack.rollResult}</Result>}
    </Attack>
  );
};
  return (
    <Section>
      <h3>Common Attacks</h3>
      {['Melee', 'Ranged', 'Ether'].map(type => (
        <div key={type} style={{ marginBottom: '8px' }}>
          <button onClick={() => attack(`${type}Light`, false)}>
            {type} Light (2 AP, 1d6)
          </button>
          <button onClick={() => attack(`${type}Heavy`, true)}>
            {type} Heavy (3 AP, 2d6)
          </button>
        </div>
      ))}

      <h4>Last Rolls</h4>
      {Object.entries(state.lastRolls).map(([k, v]) => (
        <div key={k}>{k}: <strong>{v}</strong></div>
      ))}
    </Section>
  );
}