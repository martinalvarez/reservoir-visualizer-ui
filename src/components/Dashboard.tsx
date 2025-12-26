import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useReservoirData } from '../hooks/useReservoirData';
// Import the ErrorBoundary from its new location
import ErrorBoundary from './common/ErrorBoundary';

const BASE_URL = 'http://localhost:5085/api/Reservoir';

export const Dashboard = () => {
  const { points, stats, loading, error } = useReservoirData(BASE_URL);

  if (loading) return <div style={{ padding: '20px' }}>Loading real-time telemetry...</div>;

  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ marginTop: 0, marginBottom: '8px' }}>Operational Dashboard</h1>
        <p style={{ color: '#16a34a', margin: 0, fontWeight: 'bold' }}>● Live from .NET Backend</p>
      </div>

      {/* KPI Section - Usually safe, but can be wrapped if needed */}
      <div style={kpiGridStyle}>
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

      {/* Chart Section - Protected with a custom fallback */}
      <ErrorBoundary
        fallback={
          <div style={chartWrapperStyle}>Chart visualization is currently unavailable.</div>
        }
      >
        <div style={chartWrapperStyle}>
          <h3 style={chartTitleStyle}>Pressure Trend (from JSON)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={points}>
              <XAxis dataKey="id" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip
                labelFormatter={(value) => `Point ID: ${value}`}
                formatter={(value, name, props: any) => {
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
      </ErrorBoundary>

      {/* Table Section - Protected with default ErrorBoundary UI */}
      <ErrorBoundary>
        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                <th style={tableCellStyle}>Point ID</th>
                <th style={tableCellStyle}>Formation / Layer</th>
                <th style={tableCellStyle}>Pressure</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.id} style={tableRowStyle}>
                  <td style={tableCellStyle}>{p.id}</td>
                  <td style={tableCellStyle}>{p.layerName}</td>
                  <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>{p.pressure} PSI</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ErrorBoundary>
    </div>
  );
};

// Styles remain the same below...
const kpiGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
};
const kpiCardStyle = {
  padding: '20px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e4e4e7',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '8px',
};
const chartWrapperStyle = {
  height: '400px',
  width: '100%',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e4e4e7',
  boxSizing: 'border-box' as const,
};
const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, fontSize: '14px' };
const tableHeaderRowStyle = { textAlign: 'left' as const, borderBottom: '1px solid #e4e4e7' };
const tableRowStyle = { borderBottom: '1px solid #f4f4f5' };
const tableCellStyle = { padding: '12px' };
const kpiLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#71717a',
  letterSpacing: '0.05em',
};
const kpiValueStyle = { fontSize: '1.75rem', fontWeight: 'bold', color: '#18181b' };
const unitStyle = { fontSize: '1rem', fontWeight: 'normal', color: '#a1a1aa' };
const chartTitleStyle = { marginTop: 0, marginBottom: '20px', fontSize: '1rem', color: '#18181b' };
