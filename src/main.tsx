import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/localStorageDebugger'
import './utils/debugConsoleCommands'
// Membership fee fixer removed - now using Supabase as single source of truth

createRoot(document.getElementById("root")!).render(<App />);
