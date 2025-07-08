
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

interface MathVisualizationProps {
  functionExpression: string;
  transformations: {
    translation: { x: number; y: number; z: number };
    scaling: { x: number; y: number; z: number };
    reflection: { x: boolean; y: boolean; z: boolean };
  };
}

const FunctionSurface: React.FC<{ 
  expression: string; 
  transformations: any;
}> = ({ expression, transformations }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const size = 10;
    const resolution = 50;
    const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);
    const positions = geometry.attributes.position.array as Float32Array;
    
    // Parse and evaluate the function
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      
      try {
        // Simple function evaluation (expand this for more complex functions)
        let z = 0;
        if (expression.includes('x^2') && expression.includes('y^2')) {
          z = (x * x + y * y) * 0.1; // Scale down for better visualization
        } else if (expression.includes('sin(x)')) {
          z = Math.sin(x) * 2;
        } else if (expression.includes('cos(x)')) {
          z = Math.cos(x) * 2;
        } else if (expression.includes('x^2')) {
          z = x * x * 0.1;
        } else {
          z = Math.sin(x) * Math.cos(y);
        }
        
        // Apply transformations
        const { translation, scaling, reflection } = transformations;
        
        // Apply scaling
        z *= scaling.y;
        
        // Apply reflection
        if (reflection.y) z *= -1;
        
        positions[i + 2] = z;
      } catch (error) {
        positions[i + 2] = 0;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, [expression, transformations]);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      
      // Apply transformations
      const { translation, scaling, reflection } = transformations;
      
      meshRef.current.position.set(
        translation.x * (reflection.x ? -1 : 1),
        translation.z,
        translation.y * (reflection.y ? -1 : 1)
      );
      
      meshRef.current.scale.set(
        scaling.x * (reflection.x ? -1 : 1),
        1,
        scaling.z * (reflection.z ? -1 : 1)
      );
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#00ffff"
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
};

const CoordinateSystem: React.FC = () => {
  return (
    <group>
      {/* Grid */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#ffffff"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#00ffff"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />
      
      {/* Axes */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-10, 0, 0, 10, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff0000" />
      </line>
      
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -10, 0, 0, 10, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00ff00" />
      </line>
      
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -10, 0, 0, 10])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#0000ff" />
      </line>
      
      {/* Axis labels */}
      <Text
        position={[11, 0, 0]}
        fontSize={1}
        color="#ff0000"
        anchorX="center"
        anchorY="middle"
      >
        X
      </Text>
      <Text
        position={[0, 11, 0]}
        fontSize={1}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        Y
      </Text>
      <Text
        position={[0, 0, 11]}
        fontSize={1}
        color="#0000ff"
        anchorX="center"
        anchorY="middle"
      >
        Z
      </Text>
    </group>
  );
};

const MathVisualization: React.FC<MathVisualizationProps> = ({
  functionExpression,
  transformations
}) => {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([15, 15, 15]);

  return (
    <div className="h-96 w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <CoordinateSystem />
        <FunctionSurface 
          expression={functionExpression} 
          transformations={transformations}
        />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-black/50 p-2 rounded text-white text-sm">
        <p>f(x,y) = {functionExpression}</p>
        <p className="text-xs text-gray-300 mt-1">
          Click and drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
};

export default MathVisualization;
