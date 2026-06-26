import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import dgram from 'node:dgram';

// Asks the OS which IP address it would use to connect to the internet, and returns that.
// This is more reliable than checking os.networkInterfaces(), since the user may be on ethernet or some other connection.
function getLocalIpAddress(): Promise<string> {
  return new Promise((resolve) => {
    const socket = dgram.createSocket('udp4');
    socket.connect(80, '8.8.8.8', () => {
      const address = socket.address();
      socket.close();

      resolve(address.address);
    });
  });
}

export default defineConfig({
  plugins: [
    laravel({
      input: [
        // 'resources/css/app.css',
        'resources/js/app.tsx'
      ],
      refresh: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js')
    },
  },
  server: {
    host: true,
    hmr: {
      host: await getLocalIpAddress(),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    watch: {
      ignored: ['**/storage/framework/views/**'],
    },
  },
});
