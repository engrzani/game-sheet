import styled from 'styled-components';
import { Btn, Section } from './SharedStyles';

export default function ActionPoints({ state, updateState }) {
  const ap = state.actionPoints;

 // src/components/ActionPoints.jsx
const endTurn = () => {
  const carry = state.actionPoints.current > 0 ? 1 : 0;
  updateState('actionPoints', {
    current: 5 + carry,
    max: 10,
    carriedOver: carry > 0
  });
};

  const adj = delta => {
    const newCur = Math.max(0, Math.min(10, ap.current + delta));
    updateState('actionPoints', { ...ap, current: newCur });
  };

  const display = ap.current + (ap.carriedOver ? 1 : 0);

  return (
    <Section style={{ background: ap.carriedOver ? '#4a7c4a' : '#3a3a3a' }}>
      <h3>Action Points (Max 10)</h3>
      <div>
        Current: <strong>{display}</strong>{' '}
        <Btn onClick={() => adj(1)}>+</Btn>
        <Btn onClick={() => adj(-1)}>-</Btn>
      </div>
      <button onClick={endTurn}>End Turn</button>
    </Section>
  );
}
