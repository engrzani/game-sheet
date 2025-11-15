// src/pages/index.jsx (excerpt)
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState, useCallback } from 'react';
import { saveLayoutOrder } from '../lib/storage';

const INITIAL_ORDER = ['stats', 'skillsaves', 'inventory', 'notes'];

export default function Home() {
  const [order, setOrder] = useState(() => {
    const saved = localStorage.getItem('layoutOrder');
    return saved ? JSON.parse(saved) : INITIAL_ORDER;
  });

  const moveSection = useCallback((fromIndex, toIndex) => {
    const updated = [...order];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setOrder(updated);
    saveLayoutOrder(updated);
  }, [order]);

  useEffect(() => {
    localStorage.setItem('layoutOrder', JSON.stringify(order));
  }, [order]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-4xl mx-auto p-4">
        {order.map((id, idx) => {
          switch (id) {
            case 'stats': return <LayoutSection key={id} id={id} index={idx} moveSection={moveSection}><Stats /></LayoutSection>;
            case 'skillsaves': return <LayoutSection key={id} id={id} index={idx} moveSection={moveSection}><SkillsavesGrid /></LayoutSection>;
            case 'inventory': return <LayoutSection key={id} id={id} index={idx} moveSection={moveSection}><Inventory /></LayoutSection>;
            case 'notes': return <LayoutSection key={id} id={id} index={idx} moveSection={moveSection}><Notes /></LayoutSection>;
          }
        })}
      </div>
    </DndProvider>
  );
}