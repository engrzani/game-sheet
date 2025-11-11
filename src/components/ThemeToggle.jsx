import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  
  return (
    <ToggleButton onClick={toggleTheme} theme={theme}>
      {isDarkMode ? '☀️' : '🌙'}
      <span>{isDarkMode ? 'Light' : 'Dark'}</span>
    </ToggleButton>
  );
};

const ToggleButton = styled.button`
  background: ${props => props.theme.button};
  color: ${props => props.theme.buttonText};
  border: 2px solid ${props => props.theme.borderAccent};
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
  position: static; /* Remove fixed positioning */
  
  &:hover { 
    background: ${props => props.theme.buttonHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  span {
    font-size: 12px;
    font-weight: bold;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 10px;
  }
  
  @media (max-width: 480px) {
    padding: 5px 8px;
    
    span {
      display: none; /* Hide text on very small screens */
    }
  }
`;

export default ThemeToggle;