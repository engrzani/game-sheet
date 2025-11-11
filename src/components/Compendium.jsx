// src/components/Compendium.jsx
import { useDrag, useDrop } from 'react-dnd';



// Drop zones in sections, e.g., Health drop: update equip if item has healthBonus
// Compendium.jsx
const Item = ({ name, bonus }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'stat',
    item: { bonus, field: 'health.equip' },
    collect: monitor => ({ isDragging: !!monitor.isDragging() })
  }));
  return <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>Sword (+2 HP)</div>;
};