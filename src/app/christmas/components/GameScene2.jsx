"use client";
import { useRef, useEffect, useState } from "react";
import { Environment, Box, CameraControls, OrbitControls } from "@react-three/drei";
import { Floor, NoisyTerrain } from "./FloorHuge.jsx";
import { Cabin } from "./Cabin.jsx";
import { degToRad } from "three/src/math/MathUtils";
import { Pine } from "./Pine.jsx";
import { Snowman } from "./Snowman.jsx";
import { House } from "./House.jsx";
import Santa from "./Santa.jsx";
import { RigidBody } from "@react-three/rapier";
import { CuboidCollider } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { KeyboardControls, useKeyboardControls } from '@react-three/drei'
import { Vector3 } from "three";


export function GameScene2() {


  return (
    <>
      <KeyboardControls map={[
        { name: 'forward', keys: ['ArrowUp', 'w'] },
        { name: 'backward', keys: ['ArrowDown', 's'] },
        { name: 'left', keys: ['ArrowLeft', 'a'] },
        { name: 'right', keys: ['ArrowRight', 'd'] },
      ]}>
        <Environment preset="dawn" background={false} environmentIntensity={1} />
        <fog attach="fog" args={["#e0f2fe", 600, 2000]} />
        <FallingSanta />
        <RigidBody type="fixed" position={[0, 0, 0]}>

          <NoisyTerrain position={[0, 0, 0]} />
        </RigidBody>
        <OrbitControls />
        <House scale={.15} position={[0, 3, -50]} rotation={[0, degToRad(180), 0]} roofColor="yellow" />
        <House scale={.15} position={[-80, 3, -70]} rotation={[0, degToRad(-200), 0]} roofColor="red" />
        <House scale={.15} position={[-30, 3, 30]} rotation={[0, degToRad(-160), 0]} roofColor="green" />
        <House scale={.15} position={[90, 3, 0]} rotation={[0, degToRad(160), 0]} roofColor="blue" />
        <Floor />
        <Pine scale={16} position={[3, 6, -50]} rotation={[0, degToRad(30), degToRad(-2)]} />
        <Pine scale={16} position={[-40, 8, -60]} rotation={[0, 0, degToRad(2)]} />
        <Pine scale={17} position={[30, 5, -80]} rotation={[0, 0, degToRad(2)]} />
        <Pine scale={18} position={[65, 5.5, -145]} rotation={[0, 0, degToRad(2)]} />
        <Pine scale={15} position={[60, 5.5, -150]} rotation={[0, 0, degToRad(2)]} />
        <Snowman scale={4} position={[10, -0.7, -22]} rotation={[0, degToRad(160), 0]} />
      </KeyboardControls>
    </>
  );
}


const FallingSanta = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const currentImpulse = useRef({ x: 0, y: 0, z: 0 });
  const currentRoll = useRef(0);
  // Add state for game start
  const [hasStarted, setHasStarted] = useState(false);

  const santaPhysicsRef = useRef();
  const santaBodyRef = useRef();

  const camera = useThree((state) => state.camera)
  camera.far = 10000
  camera.position.set(0, 550, 700)
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()
  // Add click handler to start the game
  useEffect(() => {
    const handleStart = (event) => {
      if (!hasStarted && event.code === 'Space') {
        setHasStarted(true);
      }
    };

    window.addEventListener('keydown', handleStart);
    return () => window.removeEventListener('keydown', handleStart);
  }, [hasStarted]);

  // Modify RigidBody type based on game state
  useFrame((state, delta) => {
    if (!hasStarted) return; // Skip physics updates if game hasn't started

    const keys = getKeys()


    console.log(keys)
    if (keys.forward) {
      currentImpulse.current.z -= .5;
    }
    if (keys.backward) {
      currentImpulse.current.z += .5;
    }
    if (keys.left) {
      currentImpulse.current.x -= .5;
      currentRoll.current = THREE.MathUtils.lerp(currentRoll.current, 0.3, delta * 5);
      if (santaBodyRef.current) {
        const currentRotation = santaBodyRef.current.rotation;
        santaBodyRef.current.rotation.set(
          currentRotation.x,
          currentRotation.y + degToRad(-1),
          currentRotation.z
        );
      }
    }
    if (keys.right) {
      currentImpulse.current.x += .5;
      currentRoll.current = THREE.MathUtils.lerp(currentRoll.current, -0.3, delta * 5);
      // Apply the roll to the Santa model
      if (santaBodyRef.current) {
        const currentRotation = santaBodyRef.current.rotation;
        santaBodyRef.current.rotation.set(
          currentRotation.x,
          currentRotation.y + degToRad(1),
          currentRotation.z
        );
      }
    }
    if (!keys.left && !keys.right) {
      currentRoll.current = THREE.MathUtils.lerp(currentRoll.current, 0, delta * 5);

    }



    // Lerp impulse back to 0
    currentImpulse.current.x = THREE.MathUtils.lerp(currentImpulse.current.x, 0, delta * 2);
    currentImpulse.current.z = THREE.MathUtils.lerp(currentImpulse.current.z, 0, delta * 2);

    santaPhysicsRef.current.applyImpulse({
      x: currentImpulse.current.x,
      y: 0,
      z: currentImpulse.current.z
    }, true);



    console.log(currentImpulse.current)
    // if (!santaPhysicsRef.current) return;

    // Get Santa's position
    const santaPosition = santaPhysicsRef.current.translation();

    // Calculate camera position (behind and above Santa)
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(santaPosition);
    cameraPosition.z += 10; // Further back
    cameraPosition.y += 20; // Higher up

    // Calculate camera target (slightly above Santa)
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(santaPosition);
    cameraTarget.y += 5; // Look slightly above Santa

    // Smooth camera movement
    state.camera.position.lerp(cameraPosition, delta * 5);

    // Create a temporary vector for the current look target
    const currentLookAt = new THREE.Vector3();
    state.camera.getWorldDirection(currentLookAt);

    // Make the camera look at the target
    const lookAtPosition = new THREE.Vector3();
    lookAtPosition.copy(cameraTarget);
    state.camera.lookAt(lookAtPosition);
  });

  return (
    <RigidBody
      ref={santaPhysicsRef}
      type={hasStarted ? "dynamic" : "fixed"}
      position={[0, 540, 690]}
      colliders={false}
    >
      <CuboidCollider
        args={[1, 0.45, 2.5]}
        position={[0, .50, -0.6]}
      />
      <Santa
        scale={10}
        position={[0, 0, 0]}
        rotation={[degToRad(-90), 0, 0]}
        ref={santaBodyRef}
      />
    </RigidBody>
  );
};




