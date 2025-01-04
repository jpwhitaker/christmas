import { useMemo } from 'react';
import { createNoise2D } from 'simplex-noise';
import { Pine } from './Pine';
import { degToRad } from 'three/src/math/MathUtils';

function createSeededRandom(seed) {
  return function() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export default function PineForest({ 
  seed = 12345, 
  innerRadius = 30, 
  outerRadius = 100,
  density = 0.002 // Controls how many trees to generate
}) {
  const trees = useMemo(() => {
    const seededRandom = createSeededRandom(seed);
    const noise2D = createNoise2D(seededRandom);
    const trees = [];
    
    // Calculate area to determine number of points to check
    const area = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius);
    const pointsToCheck = Math.floor(area * density);
    
    for (let i = 0; i < pointsToCheck; i++) {
      // Generate random angle and radius using seeded random
      const angle = seededRandom() * Math.PI * 2;
      const radius = Math.sqrt(
        seededRandom() * (outerRadius * outerRadius - innerRadius * innerRadius) 
        + innerRadius * innerRadius
      );
      
      // Convert to cartesian coordinates
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      
      // Use noise to determine tree scale and slight position variation
      const noiseValue = noise2D(x * 0.02, z * 0.02);
      const scale = 60 + noiseValue * 3; // Scale between 25-28 (base + noise * range)
      
      // Add some noise-based variation to position
      const xOffset = noiseValue * 2;
      const zOffset = noise2D(z * 0.02, x * 0.02) * 2;
      
      // Use noise to determine if we should place a tree here
      if (noise2D(x * 0.1, z * 0.1) > 0) {
        trees.push({
          position: [x + xOffset, 0, z + zOffset],
          scale,
          rotation: [0, degToRad(16), 0]
        });
      }
    }
    
    return trees;
  }, [seed, innerRadius, outerRadius, density]);

  return (
    <group>
      {trees.map((tree, index) => (
        <Pine
          key={index}
          position={tree.position}
          scale={tree.scale}
          rotation={tree.rotation}
        />
      ))}
    </group>
  );
}
