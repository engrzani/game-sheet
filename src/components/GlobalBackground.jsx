import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';

const GlobalBackground = () => {
  const { theme } = useTheme();
  
  return <BackgroundOverlay theme={theme} />;
};

const BackgroundOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.primary};
  z-index: -1;
  pointer-events: none;
`;

export default GlobalBackground;