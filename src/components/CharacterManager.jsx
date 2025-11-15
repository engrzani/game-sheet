// src/components/CharacterManager.jsx
import { useState, useEffect } from 'react';
import { getCharacters, saveCharacter, deleteCharacter, setActiveCharacter } from '../lib/storage';

export default function CharacterManager() {
  const [chars, setChars] = useState([]);
  const [newName, setNewName] = useState('');

  useEffect(() => { setChars(getCharacters()); }, []);

  const create = () => {
    if (!newName.trim()) return;
    const id = Date.now().toString();
    saveCharacter(id, { name: newName, layoutOrder: INITIAL_ORDER });
    setChars(getCharacters());
    setActiveCharacter(id);
    setNewName('');
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-2">Characters</h3>
      <input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="New character name"
        className="border p-1 rounded w-full mb-2 text-sm"
      />
      <button onClick={create} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Create</button>

      <div className="mt-3 max-h-48 overflow-y-auto">
        {chars.map(c => (
          <div key={c.id} className="flex justify-between items-center py-1 text-sm">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => { setActiveCharacter(c.id); window.location.reload(); }}
            >
              {c.name}
            </span>
            <button
              onClick={() => { deleteCharacter(c.id); setChars(getCharacters()); }}
              className="text-red-500 text-xs"
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
}