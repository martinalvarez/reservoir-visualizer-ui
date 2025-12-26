// src/App.tsx
import { useState } from 'react';
import { LayoutDashboard, Database, Activity, Settings } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { SimulationCanvas } from './components/SimulationCanvas';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulation'>('dashboard');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f4f4f5',
      }}
    >
      {/* Header */}
      <header
        style={{
          height: '60px',
          backgroundColor: '#18181b',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 10,
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
          N-iX Reservoir Simulation System
        </h2>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: '240px',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e4e4e7',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 0',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={sidebarButtonStyle(activeTab === 'dashboard')}
            >
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              style={sidebarButtonStyle(activeTab === 'simulation')}
            >
              <Activity size={20} /> 3D Simulation
            </button>
            <hr style={{ margin: '10px 20px', border: 'none', borderTop: '1px solid #e4e4e7' }} />
            <button style={sidebarButtonStyle(false)}>
              <Database size={20} /> Data Explorer
            </button>
            <button style={sidebarButtonStyle(false)}>
              <Settings size={20} /> Settings
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <div
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              border: '1px solid #e4e4e7',
              minHeight: '80%',
            }}
          >
            {/* Conditional Rendering */}
            {activeTab === 'dashboard' ? <Dashboard /> : <SimulationCanvas />}
          </div>
        </main>
      </div>
    </div>
  );
}

const sidebarButtonStyle = (isActive: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 24px',
  border: 'none',
  backgroundColor: isActive ? '#f4f4f5' : 'transparent',
  color: isActive ? '#18181b' : '#71717a',
  textAlign: 'left' as const,
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: isActive ? '600' : '400',
  transition: 'all 0.2s',
  borderLeft: isActive ? '4px solid #18181b' : '4px solid transparent',
});

export default App;
