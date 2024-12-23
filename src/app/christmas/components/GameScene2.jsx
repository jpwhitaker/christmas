"use client";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { Environment, Box, CameraControls, OrbitControls } from "@react-three/drei";
import { NoisyTerrain } from "./FloorHuge.jsx";
import { degToRad } from "three/src/math/MathUtils";
import { Pine } from "./Pine.jsx";

import { House } from "./House.jsx";
import Santa from "./Santa.jsx";
import { RigidBody } from "@react-three/rapier";
import { CuboidCollider } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { KeyboardControls, useKeyboardControls, Cloud } from '@react-three/drei'
import { Vector3 } from "three";
import { usePlaySplat, usePlaySkydive, usePlayPerfect } from './useAppSounds';



export function GameScene2() {

  const cloudRef = useRef()
  const lightRef = useRef()
  const camera = useThree((state) => state.camera)





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
        <RigidBody type="fixed" position={[0, 0, 0]} name="noisyTerrain">
          <NoisyTerrain position={[0, 0, 0]} />
        </RigidBody>
        <OrbitControls />
        <ColliderHouse
          position={[0, 3, -50]}
          rotation={[0, degToRad(180), 0]}
          roofColor="yellow"
        />
        <ColliderHouse
          position={[-80, 3, -70]}
          rotation={[0, degToRad(-200), 0]}
          roofColor="red"
        />
        <ColliderHouse
          position={[-30, 3, 30]}
          rotation={[0, degToRad(-160), 0]}
          roofColor="green"
        />
        <ColliderHouse
          position={[90, 3, 0]}
          rotation={[0, degToRad(160), 0]}
          roofColor="blue"
        />

        <Pine scale={26} position={[3, 12, -50]} rotation={[0, degToRad(30), degToRad(-2)]} />
        <Pine scale={26} position={[-40, 12, -60]} rotation={[0, 0, degToRad(2)]} />
        <Pine scale={27} position={[30, 12, -80]} rotation={[0, 0, degToRad(2)]} />
        <Pine scale={28} position={[65, 12.5, -145]} rotation={[0, 0, degToRad(2)]} />
        <Pine scale={25} position={[60, 12.5, -150]} rotation={[0, 0, degToRad(2)]} />

  


      </KeyboardControls>
    </>
  );
}


const FallingSanta = () => {
  const [playSplat] = usePlaySplat()
  const [playPerfect] = usePlayPerfect()
  const [playSkydive, { stop }] = usePlaySkydive()
  const hasPlayedSkydive = useRef(false);
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const currentImpulse = useRef({ x: 0, y: 0, z: 0 });
  const currentRoll = useRef({x: 0, y: 0});
  // Add state for game start
  const [hasStarted, setHasStarted] = useState(false);

  const [hasCollided, setHasCollided] = useState(false);

  const santaPhysicsRef = useRef();
  const santaBodyRef = useRef();
  const camera = useThree((state) => state.camera)
  const baseRotation = useRef(new THREE.Euler(degToRad(-90), 0, 0));

  useEffect(() => {

    camera.far = 10000
    camera.fov = 50
    camera.position.set(0, 550, 700)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [])



  // Pauses start of game with spacebar
  //only active on http://localhost:3000/christmas/scene2
  useEffect(() => {
    const handleStart = (event) => {
      if (!hasStarted && event.code === 'Space') {
        setHasStarted(true);
      }
    };

    window.addEventListener('keydown', handleStart);
    return () => window.removeEventListener('keydown', handleStart);
  }, [hasStarted]);

  useEffect(() => {
    playSkydive()
    console.log('skydive')
  }, [playSkydive])

  // Modify RigidBody type based on game state
  useFrame((state, delta) => {

    // Only pause physics on scene2 page
    const isScene2 = window.location.pathname.includes('/scene2');
    if (isScene2) {
      if (!hasStarted) return;
    } else {
      setHasStarted(true);
    }

    const keys = getKeys()



    if (keys.forward) {
      currentImpulse.current.z -= .5;
      currentRoll.current.x -= delta * 2; // Continuously add to roll
      if (santaBodyRef.current) {
        // Create a new euler rotation starting from the base rotation
        const euler = new THREE.Euler();
        euler.copy(baseRotation.current);
        
        // Apply additional rotations in the correct order
        euler.z += currentRoll.current.z || 0;  // Tilt forward/backward
        euler.y += currentRoll.current.y || 0;  // Turn left/right
        euler.x += currentRoll.current.x || 0;  // Any x rotation you might have

        // Apply the combined rotation
        santaBodyRef.current.rotation.copy(euler);
      }
    }
    if (keys.backward) {
      currentImpulse.current.z += .5;
      currentRoll.current.x += delta * 2; // Continuously add to roll
      if (santaBodyRef.current) {
        // Create a new euler rotation starting from the base rotation
        const euler = new THREE.Euler();
        euler.copy(baseRotation.current);
        
        // Apply additional rotations in the correct order
        euler.z += currentRoll.current.z || 0;  // Tilt forward/backward
        euler.y += currentRoll.current.y || 0;  // Turn left/right
        euler.x += currentRoll.current.x || 0;  // Any x rotation you might have

        // Apply the combined rotation
        santaBodyRef.current.rotation.copy(euler);
      }
    }
    if (keys.left) {
      currentImpulse.current.x -= .5;
      currentRoll.current.y -= delta * 2; // Continuously add to roll
      if (santaBodyRef.current) {
        // Create a new euler rotation starting from the base rotation
        const euler = new THREE.Euler();
        euler.copy(baseRotation.current);
        
        // Apply additional rotations in the correct order
        euler.z += currentRoll.current.z || 0;  // Tilt forward/backward
        euler.y += currentRoll.current.y || 0;  // Turn left/right
        euler.x += currentRoll.current.x || 0;  // Any x rotation you might have

        // Apply the combined rotation
        santaBodyRef.current.rotation.copy(euler);
      }
    }
    if (keys.right) {
      currentImpulse.current.x += .5;
      currentRoll.current.y += delta * 2; // Continuously subtract from roll
      if (santaBodyRef.current) {
        // Create a new euler rotation starting from the base rotation
        const euler = new THREE.Euler();
        euler.copy(baseRotation.current);
        
        // Apply additional rotations in the correct order
        euler.z += currentRoll.current.z || 0;  // Tilt forward/backward
        euler.y += currentRoll.current.y || 0;  // Turn left/right
        euler.x += currentRoll.current.x || 0;  // Any x rotation you might have

        // Apply the combined rotation
        santaBodyRef.current.rotation.copy(euler);
      }
    }
    if (!keys.left && !keys.right) {
      currentRoll.current.y = THREE.MathUtils.lerp(currentRoll.current.y, 0, delta * 5);
      currentRoll.current.x = THREE.MathUtils.lerp(currentRoll.current.x, 0, delta * 5);
      if (santaBodyRef.current) {
        // Create a new euler rotation starting from the base rotation
        const euler = new THREE.Euler();
        euler.copy(baseRotation.current);
        
        // Apply additional rotations in the correct order
        euler.z += currentRoll.current.z || 0;  // Tilt forward/backward
        euler.y += currentRoll.current.y || 0;  // Turn left/right
        euler.x += currentRoll.current.x || 0;  // Any x rotation you might have

        // Apply the combined rotation
        santaBodyRef.current.rotation.copy(euler);
      }
    }



    // Lerp impulse back to 0
    currentImpulse.current.x = THREE.MathUtils.lerp(currentImpulse.current.x, 0, delta * 2);
    currentImpulse.current.z = THREE.MathUtils.lerp(currentImpulse.current.z, 0, delta * 2);
    if (!santaPhysicsRef.current) return;

    santaPhysicsRef.current.applyImpulse({
      x: currentImpulse.current.x,
      y: 0,
      z: currentImpulse.current.z
    }, true);

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

  // Modify collision handler
  const handleCollision = ({ other }) => {
    if (hasCollided) return;
    console.log('collision')
    stop()

    if (other.colliderObject?.name === 'noisyTerrain') {
      console.log('splat - first collision');
      playSplat();
      setHasCollided(true);
    }

    if (other.colliderObject?.name === 'house') {
      console.log('house - first collision');
      playPerfect();
      setHasCollided(true);
    }
  }

  return (
    <RigidBody
      ref={santaPhysicsRef}
      type={hasStarted ? "dynamic" : "fixed"}
      position={[0, 540, 690]}
      colliders={false}
      onCollisionEnter={handleCollision}
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

const ColliderHouse = ({ position, rotation, roofColor }) => {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false} >
        <CuboidCollider args={[9, 12, 5]} rotation={[0, degToRad(9), 0]} position={[23, 0, 3]} name="house" />
        <House
          scale={.15}
          position={[0, 0, 0]}
          roofColor={roofColor}
        />
      </RigidBody>
    </group>
  );
};