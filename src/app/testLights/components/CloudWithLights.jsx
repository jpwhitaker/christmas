import { useRef, useEffect } from "react";
import { Billboard, Cloud, useHelper } from "@react-three/drei";
import { SpotLightHelper } from "three";

export function CloudWithLights({ position = [0, 0, 0], scale = 1, debug = false }) {
  // Create refs for all four spotlights
  const frontLightRef = useRef();
  const backLightRef = useRef();
  const leftLightRef = useRef();
  const rightLightRef = useRef();

  // Add refs for spotlight targets
  const frontTargetRef = useRef();
  const backTargetRef = useRef();
  const leftTargetRef = useRef();
  const rightTargetRef = useRef();

  // Only show helpers if debug is true
  if (debug) {
    useHelper(frontLightRef, SpotLightHelper, "yellow");

  }

  const lightConfig = {
    intensity: 5000,
    angle: Math.PI / 6,
    penumbra: 0.5,
    distance: 22,
  };

  useEffect(() => {
    frontLightRef.current.target = frontTargetRef.current;
  }, []);

  return (
    <group position={position}>
      <Billboard>
      <Cloud scale={scale} />
      
      {/* Front Light */}
      <spotLight
        ref={frontLightRef}
        position={[0, 0, 15]}
        color="#ffffff"
        {...lightConfig}
      />
      <object3D ref={frontTargetRef} position={[0, 0, 0]} />
      </Billboard>
    </group>
    
  );
}
