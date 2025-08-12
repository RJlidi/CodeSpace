import { io } from "socket.io-client";

interface SocketOptions {
  "force new connection": boolean;
  reconnectionAttempts: number;
  timeout: number;
  transports: string[];
  reconnectionDelay: number;
  reconnectionDelayMax: number;
  maxReconnectionAttempts: number;
}

export const initSocket = async () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const healthCheck = async (retries = 10): Promise<void> => {
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch(BACKEND_URL, {
          cache: 'no-store',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        return;
      } catch (error) {
        if (i === retries - 1) {
          throw new Error(`Failed to connect to server after ${retries} attempts`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  await healthCheck();

  const options: SocketOptions = {
    "force new connection": true,
    reconnectionAttempts: 10,
    timeout: 10000,
    transports: ["websocket"],
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 10
  };

  return io(BACKEND_URL, options);
};
