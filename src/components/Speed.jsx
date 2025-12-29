import { Btn, Section } from './SharedStyles';
import { useTheme } from '../hooks/useTheme';

export default function Speed({ state, updateState }) {
  const { theme } = useTheme();
  const sp = state.speed;
  const total = sp.base + sp.mods;
  const half = Math.floor(total / 2);

  const adj = (field, delta) =>
    updateState('speed', { ...sp, [field]: Math.max(0, sp[field] + delta) });

  return (
    <Section theme={theme} style={{ borderLeftColor: theme.sectionBorderGrey }}>
      <h3>Speed</h3>
      <div>Total: {total}</div>
      <div>Half (rough): {half}</div>
      <div>
        Base: {sp.base}{' '}
        <Btn theme={theme} onClick={() => adj('base', 1)}>+</Btn>
        <Btn theme={theme} onClick={() => adj('base', -1)}>-</Btn>
      </div>
      <div>
        Mods: {sp.mods}{' '}
        <Btn theme={theme} onClick={() => adj('mods', 1)}>+</Btn>
        <Btn theme={theme} onClick={() => adj('mods', -1)}>-</Btn>
      </div>
    </Section>
  );
}