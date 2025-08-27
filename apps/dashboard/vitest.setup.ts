import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extend Vitest's expect with jest-dom matchers
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// Mock Socket.IO to prevent hanging tests
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    disconnect: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connected: false,
    id: 'test-socket-id',
  })),
}));

// Mock axios to prevent hanging HTTP requests
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(() => Promise.resolve({ data: {} })),
      post: vi.fn(() => Promise.resolve({ data: {} })),
      put: vi.fn(() => Promise.resolve({ data: {} })),
      delete: vi.fn(() => Promise.resolve({ data: {} })),
    })),
  },
}));

// Force cleanup after each test
afterEach(() => {
  vi.clearAllTimers();
  vi.clearAllMocks();
  cleanup(); // Clean up DOM after each test
});
