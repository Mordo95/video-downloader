import { defineConfig } from 'vite'
import Userscript from 'vite-plugin-tm-userscript'
import {resolve} from 'path';

export default defineConfig({
  plugins: [
    Userscript({
    })
  ],
  resolve: {
    alias: {
      '@' : resolve(__dirname, './src'),
      '@style' : resolve(__dirname, './css'),
    }
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'VideoDL',
      // the proper extensions will be added
      fileName: 'userscript.user.js'
    },
  }
})