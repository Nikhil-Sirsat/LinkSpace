import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // proxy: {
    //   '/api/user': 'http://localhost:5050',
    //   '/api/post': 'http://localhost:5050',
    //   '/api/like': 'http://localhost:5050',
    //   '/api/comment': 'http://localhost:5050',
    //   '/api/follow': 'http://localhost:5050',
    //   '/api/savedPost': 'http://localhost:5050',
    //   '/api/messages': 'http://localhost:5050',
    //   '/api/notify': 'http://localhost:5050',
    //   '/api/story': 'http://localhost:5050',
    // },
  },
  plugins: [react()],
});
