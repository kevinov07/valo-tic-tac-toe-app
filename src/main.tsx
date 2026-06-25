import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/geist'
import '@fontsource/geist-mono'
import '@fontsource/chakra-petch'

import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
