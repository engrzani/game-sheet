// src/lib/storage.js
const DB_NAME = 'GameSheetDB';
let db;

const openDB = () => {
  return new Promise((resolve) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore('characters', { keyPath: 'id' });
    };
    req.onsuccess = () => { db = req.result; resolve(db); };
  });
};

export const getCharacters = async () => {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction('characters', 'readonly');
    const store = tx.objectStore('characters');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
  });
};

export const saveCharacter = async (id, data) => {
  const db = await openDB();
  const tx = db.transaction('characters', 'readwrite');
  const store = tx.objectStore('characters');
  store.put({ id, ...data, updatedAt: Date.now() });
  return tx.complete;
};

export const setActiveCharacter = (id) => {
  localStorage.setItem('activeCharId', id);
};

export const getActiveCharacter = () => {
  return localStorage.getItem('activeCharId');
};