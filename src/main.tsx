import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/localStorageDebugger'
import './utils/debugConsoleCommands'
import './utils/membershipFeeFixer' // Auto-run membership fee fix on app start

createRoot(document.getElementById("root")!).render(<App />);
