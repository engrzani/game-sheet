// src/components/PlusMinusButton.jsx
export default function PlusMinusButton({ onClick, type = 'plus', disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center
        transition-all hover:scale-110 active:scale-95
        ${type === 'plus' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {type === 'plus' ? '+' : '−'}
    </button>
  );
}