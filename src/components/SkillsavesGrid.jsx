// src/components/SkillsavesGrid.jsx
export default function SkillsavesGrid() {
  return (
    <div className="grid grid-cols-4 gap-2 text-xs">
      {skillsaves.map(s => (
        <div
          key={s.id}
          className="bg-gray-50 p-1.5 rounded border text-center flex flex-col"
        >
          <div className="font-medium truncate">{s.name}</div>
          <div className="flex justify-center gap-1 mt-1">
            <PlusMinusButton type="minus" onClick={() => dec(s.id)} />
            <span className="w-6 text-center">{s.value}</span>
            <PlusMinusButton type="plus" onClick={() => inc(s.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}