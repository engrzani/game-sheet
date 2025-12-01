import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';

export default function ActionPoints({ state, updateState }) {
  const { theme } = useTheme();
  const ap = state.actionPoints;

  // Ensure all values are valid numbers with fallbacks
  const current = Number.isFinite(ap.current) ? ap.current : 5;
  const baseMax = Number.isFinite(ap.baseMax) ? ap.baseMax : 10;
  const carriedOver = Boolean(ap.carriedOver);

  // Only +1 AP when ending turn with remaining AP
  const endTurn = () => {
    const bonus = current > 0 ? 1 : 0;
    updateState('actionPoints', {
      current: baseMax + bonus,
      max: baseMax,
      baseMax: baseMax,
      carriedOver: bonus > 0
    });
  };

  // Players can adjust current AP for spells/effects - max is 11 (base 10 + 1)
  const adjCurrent = delta => {
    const newCur = Math.max(0, Math.min(11, current + delta));
    updateState('actionPoints', { 
      current: newCur,
      max: baseMax,
      baseMax: baseMax,
      carriedOver: carriedOver
    });
  };

  // Reset carriedOver status
  const resetCarryOver = () => {
    updateState('actionPoints', {
      current: current,
      max: baseMax,
      baseMax: baseMax,
      carriedOver: false
    });
  };

  const adjBaseMax = delta => {
    const newBaseMax = Math.max(0, Math.min(10, baseMax + delta));
    const newCurrent = Math.min(current, newBaseMax + (carriedOver ? 1 : 0));
    updateState('actionPoints', { 
      current: newCurrent,
      max: newBaseMax,
      baseMax: newBaseMax,
      carriedOver: carriedOver
    });
  };

  const backgroundStyle = carriedOver ? '#4a7c4a' : theme.sectionBg;

  return (
    <Section theme={theme} style={{ background: backgroundStyle, borderLeftColor: theme.sectionBorderGrey }}>
      <h3>Action Points (Max {baseMax}{carriedOver ? '+1' : ''})</h3>
      
      <div style={{ marginBottom: '8px', fontSize: '14px' }}>
        Base Max: <strong>{baseMax}</strong>{' '}
        <Btn theme={theme} onClick={() => adjBaseMax(1)}>+</Btn>
        <Btn theme={theme} onClick={() => adjBaseMax(-1)}>-</Btn>
      </div>
      
      <div style={{ fontSize: '14px' }}>
        Current: <strong>{current}</strong>{carriedOver ? ' (+1)' : ''}{' '}
        <Btn theme={theme} onClick={() => adjCurrent(1)}>+</Btn>
        <Btn theme={theme} onClick={() => adjCurrent(-1)}>-</Btn>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button 
          onClick={endTurn}
          style={{
            background: theme.button,
            color: theme.buttonText,
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            flex: 1
          }}
        >
          End Turn
        </button>
        {carriedOver && (
          <button 
            onClick={resetCarryOver}
            style={{
              background: '#ff8800',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            Reset +1
          </button>
        )}
      </div>
    </Section>
  );
}
