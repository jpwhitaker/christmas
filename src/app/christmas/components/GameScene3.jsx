"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment} from "@react-three/drei";
import { Floor, NoisyTerrain } from "./terrain/Floor";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from 'three';
import { Cabin } from "./scenery/Cabin";
import { degToRad } from "three/src/math/MathUtils";
import { Pine } from "./scenery/Pine";
import { BreakableSnowman } from "./scenery/BreakableSnowman";
import { easing } from 'maath'
import { useThree } from "@react-three/fiber";
import { PresentStack } from "./interactable/PresentStack";
import { SpringySanta } from './interactable/SpringySanta';
import { Snowball } from "./player/Snowball";

export function GameScene3({ onPositionUpdate }) {
  const basePosition = [10, 5, 40];
  const sleighRef = useRef(null);
  const [snowballs, setSnowballs] = useState([]);
  const { camera, pointer, raycaster } = useThree();

  useThree(({ camera }) => {
    camera.fov = 30;
    camera.updateProjectionMatrix();
  });

  useFrame((state, delta) => {
    const [baseX, baseY, baseZ] = basePosition;

    // Add slight movement relative to the base position
    easing.damp3(
      state.camera.position,
      [
        baseX + -state.pointer.x * 2,
        baseY + state.pointer.y * 1.5,
        baseZ
      ],
      0.3,
      delta
    );
    state.camera.lookAt(10, 0, 0);

    // Get sleigh position and pass it up
    if (sleighRef.current && (onPositionUpdate !== undefined)) {
      const sledPosition = sleighRef.current.translation();
      onPositionUpdate(sledPosition);
    }
  });

  const handleClick = (event) => {
    // Update raycaster with current pointer position
    raycaster.setFromCamera(pointer, camera);
    
    // Calculate shooting direction (from camera through pointer)
    const direction = new THREE.Vector3();
    raycaster.ray.direction.normalize();
    direction.copy(raycaster.ray.direction);
    
    // Create snowball with some initial velocity
    const startPos = camera.position.clone();
    const velocity = direction.multiplyScalar(100); // or even higher values
    
    setSnowballs(prev => [
      ...prev,
      {
        id: Date.now(),
        position: [startPos.x, startPos.y, startPos.z],
        velocity: [velocity.x, velocity.y, velocity.z]
      }
    ]);
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {snowballs.map(snowball => (
        <Snowball 
          key={snowball.id} 
          position={snowball.position}
          scale={0.5}
          linearVelocity={snowball.velocity}
        />
      ))}
      {/* <Snowball position={[0, 10, 0]} scale={1} /> */}
      <Environment preset="dawn" background={false} environmentIntensity={1} />
      <fog attach="fog" args={["#e0f2fe", 20, 350]} />
      
      
      <RigidBody type="fixed" colliders={"trimesh"} name="terrain">
        <NoisyTerrain />
      </RigidBody>
      
      <RigidBody type="fixed" position={[-7, 3, -50]} rotation={[0, degToRad(30), 0]} name="cabin">
        <CuboidCollider args={[4, 4, 4]} />
        <Cabin scale={8} />
      </RigidBody>

      <SpringySanta />
      <Floor />

      <RigidBody type="fixed" position={[3, 6, -50]} rotation={[0, degToRad(30), degToRad(-2)]} name="tree">
        <Pine scale={12} />
      </RigidBody>
      <RigidBody type="fixed" position={[-30, 8, -60]} rotation={[0, 0, degToRad(2)]} name="tree">
        <Pine scale={12} />
      </RigidBody>
      <Pine scale={10} position={[30, 5, -80]} rotation={[0, 0, degToRad(2)]} />
      <Pine scale={8} position={[65, 5.5, -145]} rotation={[0, 0, degToRad(2)]} />
      <Pine scale={7} position={[60, 5.5, -150]} rotation={[0, 0, degToRad(2)]} />
      
      <BreakableSnowman position={[10, -0.7, -22]} scale={4} rotation={[0, degToRad(160), 0]} />
      <PresentStack position={[15, 0, 8]} scale={3} rotation={[0, degToRad(-20), 0]} />
      <PresentStack position={[-15, 0.5, -29]} scale={3} rotation={[0, degToRad(30), 0]} />
    </>
  );
}