import React, { useRef, useEffect } from "react";
import { useHelper } from "@react-three/drei";
import { DirectionalLightHelper, CameraHelper } from "three";

export function SunDirectionalLight({
  position = [200, 400, 500],
  intensity = 1.5,
  color = "white",
  // Helper props
  helperSize = 5,
  helperColor = "yellow",
  debug = false,
}) {
  const lightRef = useRef();
  const helperRef = useRef();

  // Add debug logging
  useEffect(() => {
    console.log('Light ref:', lightRef.current);
    console.log('Light shadow camera:', lightRef.current?.shadow?.camera);
    console.log('Helper ref:', helperRef.current);
  }, []);

  // Only show directional light helper when debug is true
  useHelper(debug ? lightRef : null, DirectionalLightHelper, helperSize, helperColor);

  // Create camera helper when light is available and debug is true
  useEffect(() => {
    if (debug && lightRef.current?.shadow?.camera) {
      console.log('Creating camera helper');
      const helper = new CameraHelper(lightRef.current.shadow.camera);
      helper.material.color.setHex(0xff0000);
      helperRef.current = helper;
      lightRef.current.parent.add(helper);

      return () => {
        console.log('Removing camera helper');
        if (helper.parent) {
          helper.parent.remove(helper);
        }
      };
    }
  }, [debug]);

  return (
    <directionalLight
      ref={lightRef}
      castShadow
      position={position}
      intensity={intensity}
      color={color}
      // Shadow settings (tweak as needed):
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-near={0.5}
      shadow-camera-far={940}
      shadow-camera-left={-300}
      shadow-camera-right={300}
      shadow-camera-top={200}
      shadow-camera-bottom={-200}
    />
  );
}
