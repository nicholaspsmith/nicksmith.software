import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { App } from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'

// Console greeting for curious developers
console.log(`
%c     _      _                  _ _   _                  __ _
%c _ __ (_) ___| | _____ _ __ ___ (_) |_| |__   ___  ___  / _| |___      ____ _ _ __ ___
%c| '_ \\| |/ __| |/ / __| '_ \` _ \\| | __| '_ \\ / __|/ _ \\| |_| __\\ \\ /\\ / / _\` | '__/ _ \\
%c| | | | | (__|   <\\__ \\ | | | | | | |_| | | |\\__ \\ (_) |  _| |_ \\ V  V / (_| | | |  __/
%c|_| |_|_|\\___|_|\\_\\___/_| |_| |_|_|\\__|_| |_||___/\\___/|_|  \\__| \\_/\\_/ \\__,_|_|  \\___|
`,
  'color: #3d9ae8',
  'color: #3d9ae8',
  'color: #3d9ae8',
  'color: #3d9ae8',
  'color: #3d9ae8'
);
console.log(
  '%c📧 Get in touch: %cme@nicksmith.software',
  'color: #666; font-size: 14px;',
  'color: #3d9ae8; font-size: 14px; text-decoration: underline; cursor: pointer;'
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
