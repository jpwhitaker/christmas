import { RigidBody } from "@react-three/rapier";
import { Box } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { createNoise2D } from 'simplex-noise';
import * as THREE from 'three';

const Floor = () => {
  return (
    <>
      <RigidBody type="fixed">
        <Box position={[18, -2, 0]} args={[6, 4, 7]} rotation={[0, 0, Math.PI / 6]} >
          <meshPhysicalMaterial
            color="white"
            wireframe={false}
            roughness={0.9}
            metalness={0.5}
            envMapIntensity={100}
            reflectivity={0.5}
            transmission={0} />
        </Box>
      </RigidBody>
      <RigidBody type="fixed">
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.4, 0]}
          receiveShadow
        >
          <planeGeometry args={[40, 20]} />
          <meshPhysicalMaterial color="white" transparent={true} opacity={0} />
        </mesh>
      </RigidBody>


    </>
  )
}

function createSeededRandom(seed) {
  return function () {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const seededRandom = createSeededRandom(13); // Use any number as seed
const noise2D = createNoise2D(seededRandom);

//Add simplex noise plane here representing a snowy ground plane with hills
const NoisyTerrain = ({ position = [-20, -0, -200] }) => {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const planeGeometry = new THREE.PlaneGeometry(500, 500, 50, 50); // Subdivided plane
    const positions = planeGeometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const noise = noise2D(x * 0.01, y * 0.01); // Adjust frequency with * 0.1
      positions[i + 2] = noise * 5; // Adjust amplitude with * 5
    }

    planeGeometry.attributes.position.needsUpdate = true;
    planeGeometry.computeVertexNormals(); // Recalculate normals for lighting

    return planeGeometry;
  }, []);

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
      receiveShadow
      castShadow
    >
      <primitive attach="geometry" object={geometry} />
      <meshPhysicalMaterial
        color="white"
        wireframe={false}
        roughness={0.9}
        metalness={0.5}
        envMapIntensity={100}
        reflectivity={0.5}
        transmission={0}
      />
    </mesh>
  );
}

export { Floor, NoisyTerrain }

