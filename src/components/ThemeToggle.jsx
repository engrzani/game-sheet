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
  position: fixed;
  top: 12px;
  right: 120px; /* Position next to export button */
  z-index: 100;
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
  
  &:hover { 
    background: ${props => props.theme.buttonHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  span {
    font-size: 12px;
    font-weight: bold;
  }
`;

export default ThemeToggle;