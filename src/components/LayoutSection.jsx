// src/components/LayoutSection.jsx
import { useDrag, useDrop } from 'react-dnd';
import { useEffect } from 'react';

const ItemTypes = { SECTION: 'section' };

export default function LayoutSection({ id, index, children, moveSection }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SECTION,
    item: { id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.SECTION,
    drop: (item) => moveSection(item.index, index),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-4 mb-4 bg-white rounded-lg shadow transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${isOver ? 'ring-2 ring-blue-400' : ''}`}
    >
      {children}
    </div>
  );
}