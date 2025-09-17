
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { FunctionParser, FunctionInfo } from '@/lib/functionParser';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize } from 'lucide-react';

interface MathVisualizationProps {
  functionExpression: string;
  transformations: {
    translation: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  };
}

const FunctionVisualization: React.FC<{ 
  functionInfo: FunctionInfo; 
  transformations: any;
}> = ({ functionInfo, transformations }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Line>(null);
  
  const visualizationMode = FunctionParser.getVisualizationMode(functionInfo);
  
  // Generate geometry based on function type
  const { geometry, linePoints } = useMemo(() => {
    const { evaluator, variables, type } = functionInfo;
    
    if (type === 'single') {
      // 1D function - create line plot
      const points: THREE.Vector3[] = [];
      const range = 10;
      const resolution = 200;
      
      for (let i = 0; i <= resolution; i++) {
        const x = (i / resolution - 0.5) * range * 2;
        const vars: Record<string, number> = { [variables[0]]: x };
        const y = evaluator(vars);
        
        // Apply transformations
        const transformedY = y * transformations.scale.y;
        const transformedX = x * transformations.scale.x + transformations.translation.x;
        
        points.push(new THREE.Vector3(transformedX, transformedY + transformations.translation.y, transformations.translation.z));
      }
      
      return { geometry: null, linePoints: points };
    } else if (type === 'bivariate') {
      // 2D function - create surface
      const size = 10;
      const resolution = 50;
      const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);
      const positions = geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        
        try {
          const vars: Record<string, number> = {};
          if (variables.includes('x')) vars.x = x;
          if (variables.includes('y')) vars.y = y;
          if (variables.includes('z')) vars.z = 0;
          
          let z = evaluator(vars);
          
          // Clamp extreme values for better visualization
          z = Math.max(-20, Math.min(20, z));
          
          // Apply transformations
          z *= transformations.scale.z;
          
          positions[i + 2] = z;
        } catch (error) {
          positions[i + 2] = 0;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
      return { geometry, linePoints: null };
    } else {
      // 3D or parametric functions - create point cloud or wireframe
      const geometry = new THREE.SphereGeometry(0.05, 8, 8);
      return { geometry, linePoints: null };
    }
  }, [functionInfo, transformations]);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
      
      // Apply transformations
      const { translation, rotation, scale } = transformations;
      
      meshRef.current.position.set(
        translation.x,
        translation.y,
        translation.z
      );
      
      meshRef.current.rotation.set(
        (rotation.x * Math.PI) / 180,
        (rotation.y * Math.PI) / 180,
        (rotation.z * Math.PI) / 180
      );
      
      meshRef.current.scale.set(
        scale.x,
        scale.y,
        scale.z
      );
    }
  });

  if (visualizationMode === 'line' && linePoints) {
    return (
      <Line
        points={linePoints}
        color="#00ffff"
        lineWidth={3}
      />
    );
  }

  if (visualizationMode === 'surface' && geometry) {
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
  }

  // Fallback for complex functions
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#ff00ff" />
    </mesh>
  );
};

const CoordinateSystem: React.FC = () => {
  // Create line objects properly
  const xAxisLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const points = new Float32Array([-10, 0, 0, 10, 0, 0]);
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    return new THREE.Line(geometry, material);
  }, []);

  const yAxisLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const points = new Float32Array([0, -10, 0, 0, 10, 0]);
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    return new THREE.Line(geometry, material);
  }, []);

  const zAxisLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const points = new Float32Array([0, 0, -10, 0, 0, 10]);
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    return new THREE.Line(geometry, material);
  }, []);

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
      
      {/* Axis Lines */}
      <primitive object={xAxisLine} />
      <primitive object={yAxisLine} />
      <primitive object={zAxisLine} />
      
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const functionInfo = useMemo(() => {
    return FunctionParser.parse(functionExpression);
  }, [functionExpression]);
  
  const visualizationMode = FunctionParser.getVisualizationMode(functionInfo);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden relative transition-all duration-300 ${
      isFullScreen 
        ? 'expanded fixed inset-0 z-50 bg-black/80 w-full h-full flex' 
        : 'collapsed h-96 w-full'
    }`}>
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={() => setIsFullScreen(f => !f)}
          aria-label={isFullScreen ? 'Exit full screen' : 'Full screen'}
          variant="outline"
          size="sm"
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
        >
          {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
        className={`transition-all duration-300 ${
          isFullScreen 
            ? 'expanded w-full h-full' 
            : 'collapsed w-full h-full'
        }`}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <CoordinateSystem />
        <FunctionVisualization 
          functionInfo={functionInfo} 
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
        <p>f({functionInfo.variables.join(',')}) = {functionExpression}</p>
        <p className="text-xs text-gray-300 mt-1">
          Type: {functionInfo.type} • Mode: {visualizationMode}
        </p>
        <p className="text-xs text-gray-300">
          Click and drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
};

export default MathVisualization;
