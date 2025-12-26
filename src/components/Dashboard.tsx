import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

interface ReservoirPoint {
  id: number;
  pressure: number;
  temperature: number;
  layerName: string;
}

export const Dashboard = () => {
  const [points, setPoints] = useState<ReservoirPoint[]>([]);
  const [stats, setStats] = useState({ averagePressure: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = 'http://localhost:5085/api/Reservoir';
        const [resData, resStats] = await Promise.all([
          axios.get(`${baseUrl}/data`),
          axios.get(`${baseUrl}/stats`),
        ]);
        setPoints(resData.data);
        setStats(resStats.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading real-time telemetry...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ marginTop: 0, marginBottom: '8px' }}>Operational Dashboard</h1>
        <p style={{ color: '#16a34a', margin: 0, fontWeight: 'bold' }}>● Live from .NET Backend</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        <div style={kpiCardStyle}>
          <span style={kpiLabelStyle}>AVERAGE PRESSURE</span>
          <div style={kpiValueStyle}>
            {stats.averagePressure.toFixed(2)} <span style={unitStyle}>PSI</span>
          </div>
        </div>
        <div style={kpiCardStyle}>
          <span style={kpiLabelStyle}>LAST TEMPERATURE</span>
          <div style={kpiValueStyle}>
            {points[points.length - 1]?.temperature} <span style={unitStyle}>°C</span>
          </div>
        </div>
        <div style={kpiCardStyle}>
          <span style={kpiLabelStyle}>SYSTEM STATUS</span>
          <div style={{ ...kpiValueStyle, color: '#16a34a' }}>Stable</div>
        </div>
      </div>

      <div
        style={{
          height: '400px',
          width: '100%',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e4e4e7',
          boxSizing: 'border-box',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1rem', color: '#18181b' }}>
          Pressure Trend (from JSON)
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={points}>
            <XAxis dataKey="id" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip
              labelFormatter={(value) => `Point ID: ${value}`}
              formatter={(value, name, props) => {
                // props.payload contiene todo el objeto ReservoirPoint
                return [`${value} PSI`, `Layer: ${props.payload.layerName}`];
              }}
            />
            <Area
              type="monotone"
              dataKey="pressure"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e4e4e7' }}>
              <th style={{ padding: '12px' }}>Point ID</th>
              <th style={{ padding: '12px' }}>Formation / Layer</th>
              <th style={{ padding: '12px' }}>Pressure</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                <td style={{ padding: '12px' }}>{p.id}</td>
                <td style={{ padding: '12px' }}>{p.layerName}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.pressure} PSI</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Mantener los estilos kpiCardStyle... al final igual que antes
// Reusable Styles
const kpiCardStyle = {
  padding: '20px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e4e4e7',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '8px',
};

const kpiLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#71717a',
  letterSpacing: '0.05em',
};

const kpiValueStyle = {
  fontSize: '1.75rem',
  fontWeight: 'bold',
  color: '#18181b',
};

const unitStyle = {
  fontSize: '1rem',
  fontWeight: 'normal',
  color: '#a1a1aa',
};
