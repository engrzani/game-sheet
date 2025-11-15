
// src/components/SharedStyles.js
import styled from 'styled-components';

export const Section = styled.div`
  background: var(--card);
  padding: 16px;
  margin: 12px 0;
  border-radius: 10px;
  border-left: 5px solid var(--accent);
`;

export const BtnSmall = styled.button`
  background: var(--accent);
  color: #000;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  &:hover { background: var(--accentHover); }
`;

export const Input = styled.input`
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.inputBorder};
  padding: 6px 8px;
  border-radius: 4px;
  margin: 2px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.inputFocus};
    box-shadow: 0 0 0 2px ${props => props.theme.inputFocus}33;
  }
  
  &::placeholder {
    color: ${props => props.theme.textMuted};
  }
`;

export const Select = styled.select`
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.inputBorder};
  padding: 6px 8px;
  border-radius: 4px;
  margin: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.inputFocus};
    box-shadow: 0 0 0 2px ${props => props.theme.inputFocus}33;
  }
  
  option {
    background: ${props => props.theme.inputBg};
    color: ${props => props.theme.text};
  }
`;