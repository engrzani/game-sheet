import styled from 'styled-components';

export const Section = styled.div`
  background: ${props => props.theme.sectionBg};
  color: ${props => props.theme.text};
  padding: 12px;
  margin: 10px 0;
  border-radius: 6px;
  border-left: 4px solid ${props => props.theme.sectionBorder};
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  
  h3 {
    margin: 0 0 8px 0;
    color: ${props => props.theme.text};
    font-weight: bold;
  }
`;

export const Btn = styled.button`
  background: ${props => props.theme.button};
  color: ${props => props.theme.buttonText};
  border: none;
  margin: 0 3px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  min-width: 28px;
  
  &:hover { 
    background: ${props => props.theme.buttonHover};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
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