import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Shown in the sidebar footer so any device can tell which build it runs.
    // Build stamp is Libya time (UTC+2) — the app's only audience.
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD_DATE__: JSON.stringify(
      new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' ')
    ),
  },
})
