import { useRef, useEffect } from "react";
import { Cloud, useHelper } from "@react-three/drei";
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
    useHelper(backLightRef, SpotLightHelper, "red");
    useHelper(leftLightRef, SpotLightHelper, "blue");
    useHelper(rightLightRef, SpotLightHelper, "green");
  }

  const lightConfig = {
    intensity: 1000,
    angle: Math.PI / 6,
    penumbra: 0.2,
    distance: 20,
  };

  useEffect(() => {
    frontLightRef.current.target = frontTargetRef.current;
    backLightRef.current.target = backTargetRef.current;
    leftLightRef.current.target = leftTargetRef.current;
    rightLightRef.current.target = rightTargetRef.current;
  }, []);

  return (
    <group position={position}>
      <Cloud scale={scale} />
      
      {/* Front Light */}
      <spotLight
        ref={frontLightRef}
        position={[0, 0, 15]}
        color="#ffffff"
        {...lightConfig}
      />
      <object3D ref={frontTargetRef} position={[0, 0, 0]} />

      {/* Back Light */}
      <spotLight
        ref={backLightRef}
        position={[0, 0, -15]}
        color="#ffffff"
        {...lightConfig}
      />
      <object3D ref={backTargetRef} position={[0, 0, 0]} />

      {/* Left Light */}
      <spotLight
        ref={leftLightRef}
        position={[-15, 0, 0]}
        color="#ffffff"
        {...lightConfig}
      />
      <object3D ref={leftTargetRef} position={[0, 0, 0]} />

      {/* Right Light */}
      <spotLight
        ref={rightLightRef}
        position={[15, 0, 0]}
        color="#ffffff"
        {...lightConfig}
      />
      <object3D ref={rightTargetRef} position={[0, 0, 0]} />
    </group>
  );
}
