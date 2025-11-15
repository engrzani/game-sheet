import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';

export default function ActionPoints({ state, updateState }) {
  const { theme } = useTheme();
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
    <Section theme={theme} style={{ background: ap.carriedOver ? '#4a7c4a' : theme.sectionBg }}>
      <h3>Action Points (Max 10)</h3>
      <div>
        Current: <strong>{display}</strong>{' '}
        <Btn theme={theme} onClick={() => adj(1)}>+</Btn>
        <Btn theme={theme} onClick={() => adj(-1)}>-</Btn>
      </div>
      <button 
        onClick={endTurn}
        style={{
          background: theme.button,
          color: theme.buttonText,
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '8px'
        }}
      >
        End Turn
      </button>
    </Section>
  );
}
