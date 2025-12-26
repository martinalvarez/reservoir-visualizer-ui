import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from './Dashboard';
import { useReservoirData } from '../hooks/useReservoirData';

// 1. Mock the custom hook
vi.mock('../hooks/useReservoirData');

const mockData = {
  points: [
    { id: 1, pressure: 100, temperature: 20, layerName: 'North Layer' },
    { id: 2, pressure: 200, temperature: 25, layerName: 'South Layer' },
  ],
  stats: { averagePressure: 150 },
  loading: false,
  error: null,
};

describe('Dashboard Component', () => {
  it('renders the title and KPI data correctly', () => {
    // 2. Tell the mock what to return
    (useReservoirData as any).mockReturnValue(mockData);

    render(<Dashboard />);

    expect(screen.getByText(/Operational Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/150.00/)).toBeInTheDocument(); // Average Pressure
    expect(screen.getByText(/North Layer/i)).toBeInTheDocument();
  });

  it('filters the list when searching for a specific layer', () => {
    (useReservoirData as any).mockReturnValue(mockData);
    render(<Dashboard />);

    const input = screen.getByPlaceholderText(/Filter by formation/i);

    // Type "North" in the search input
    fireEvent.change(input, { target: { value: 'North' } });

    // "North Layer" should stay, "South Layer" should disappear
    expect(screen.getByText(/North Layer/i)).toBeInTheDocument();
    expect(screen.queryByText(/South Layer/i)).not.toBeInTheDocument();
  });
});
