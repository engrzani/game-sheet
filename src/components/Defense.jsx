import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';

export default function Defense({ state, updateState }) {
  const { theme } = useTheme();
  const d = state.defense;

  const setPhysical = delta =>
    updateState('defense', { ...d, physical: Math.max(0, d.physical + delta) });

  const setNon = (type, delta) => {
    const newVal = Math.max(0, (d.nonPhysical[type] || 0) + delta);
    updateState('defense', {
      ...d,
      nonPhysical: { ...d.nonPhysical, [type]: newVal }
    });
  };

  const deleteType = (type) => {
    const newNonPhysical = { ...d.nonPhysical };
    delete newNonPhysical[type];
    updateState('defense', { ...d, nonPhysical: newNonPhysical });
  };

  const addType = () => {
    const t = prompt('New damage type (e.g. Poison):');
    if (t) setNon(t.toLowerCase(), 0);
  };

  return (
    <Section theme={theme}>
      <h3>Defense</h3>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Physical: {d.physical}</strong>{' '}
        <Btn theme={theme} onClick={() => setPhysical(1)}>+</Btn>
        <Btn theme={theme} onClick={() => setPhysical(-1)}>-</Btn>
      </div>

      <h4>Non-Physical</h4>
      {Object.entries(d.nonPhysical).map(([type, val]) => (
        <div key={type} style={{ marginBottom: '6px' }}>
          <span style={{ textTransform: 'capitalize' }}>{type}: {val}</span>{' '}
          <Btn theme={theme} onClick={() => setNon(type, 1)}>+</Btn>
          <Btn theme={theme} onClick={() => setNon(type, -1)}>-</Btn>
          <Btn theme={theme} onClick={() => deleteType(type)} style={{ marginLeft: '8px', fontSize: '12px' }}>×</Btn>
        </div>
      ))}
      
      <button onClick={addType} style={{ 
        background: theme.button, 
        color: theme.buttonText, 
        border: 'none', 
        padding: '4px 8px', 
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '12px'
      }}>+ Add Type</button>

      <h4>Other Effects</h4>
      <textarea
        rows={2}
        value={d.otherEffects}
        onChange={e => updateState('defense', { ...d, otherEffects: e.target.value })}
        placeholder="e.g. Immune to Fire"
        style={{
          width: '100%',
          background: theme.inputBg,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: '4px',
          padding: '4px'
        }}
      />
    </Section>
  );
}