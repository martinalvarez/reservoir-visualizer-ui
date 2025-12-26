import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResponsiveContainer to avoid width/height 0 warnings in tests
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: any }) => (
      <div style={{ width: '800px', height: '400px' }}>{children}</div>
    ),
  };
});