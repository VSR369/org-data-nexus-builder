import { setupServer } from 'msw/node'
import { masterDataHandlers } from './handlers/masterDataHandlers'
import { supabaseHandlers } from './handlers/supabaseHandlers'

export const server = setupServer(
  ...masterDataHandlers,
  ...supabaseHandlers
)