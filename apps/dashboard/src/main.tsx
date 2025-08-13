import { createRoot } from 'react-dom/client';

import './index.css';
import { Root } from './components/Root/Root';
import { App } from './App';

createRoot(document.getElementById('root')).render(
  <Root withThemeSwitch={true}>
    <App />
  </Root>
);
