import { useState, useEffect } from 'react';
import axios from 'axios';

export interface ReservoirPoint {
  id: number;
  pressure: number;
  temperature: number;
  layerName: string;
}

interface ReservoirStats {
  averagePressure: number;
}

export const useReservoirData = (baseUrl: string) => {
  const [points, setPoints] = useState<ReservoirPoint[]>([]);
  const [stats, setStats] = useState<ReservoirStats>({ averagePressure: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Correct URL construction: baseUrl already includes /api/Reservoir
        const [resData, resStats] = await Promise.all([
          axios.get(`${baseUrl}/data`),
          axios.get(`${baseUrl}/stats`),
        ]);

        setPoints(resData.data);
        setStats(resStats.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch data from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  return { points, stats, loading, error };
};
