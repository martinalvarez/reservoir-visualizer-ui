import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Html } from '@react-three/drei';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ReservoirPoint {
  id: number;
  x: number;
  y: number;
  z: number;
  pressure: number;
  layerName: string;
}

export const SimulationCanvas = () => {
  const [points, setPoints] = useState<ReservoirPoint[]>([]);

  useEffect(() => {
    // We consume the same API as the Dashboard
    axios
      .get('http://localhost:5085/api/Reservoir/data')
      .then((res) => setPoints(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div
      style={{
        height: '550px',
        backgroundColor: '#09090b',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Canvas camera={{ position: [20, 20, 20], fov: 60 }}>
        <color attach="background" args={['#09090b']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} />

        {/* We map the Backend points to 3D spheres */}
        {points.map((p) => (
          <Sphere key={p.id} args={[0.6, 16, 16]} position={[p.x / 5, p.z / 500, p.y / 5]}>
            <meshStandardMaterial
              color={p.pressure > 1200 ? '#ef4444' : '#3b82f6'}
              emissive={p.pressure > 1200 ? '#ef4444' : '#1d4ed8'}
              emissiveIntensity={0.5}
            />
            <Html distanceFactor={15}>
              <div
                style={{
                  background: 'rgba(24, 24, 27, 0.9)',
                  color: '#f4f4f5',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  border: '1px solid #3f3f46',
                  pointerEvents: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                <strong>{p.layerName || 'Sensor'}</strong>
                <br />
                {p.pressure} PSI
              </div>
            </Html>
          </Sphere>
        ))}

        <gridHelper args={[50, 50, '#27272a', '#27272a']} />
        <OrbitControls makeDefault />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          color: 'white',
          pointerEvents: 'none',
        }}
      >
        <h3 style={{ margin: 0 }}>3D Spatial Distribution</h3>
        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Red: High Pressure | Blue: Normal</p>
      </div>
    </div>
  );
};
