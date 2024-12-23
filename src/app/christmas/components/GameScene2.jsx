"use client";
import { useRef, useEffect, useState } from "react";
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
import { KeyboardControls, useKeyboardControls } from '@react-three/drei'
import { Vector3 } from "three";
import { usePlaySplat, usePlayJingleTrim, usePlayPerfect } from './useAppSounds';



export function GameScene2() {

  
  // const [playJingleTrim] = usePlayJingleTrim()


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
          <NoisyTerrain position={[0, 0, 0]}  />
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
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const currentImpulse = useRef({ x: 0, y: 0, z: 0 });
  const currentRoll = useRef(0);
  // Add state for game start
  const [hasStarted, setHasStarted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [hasCollided, setHasCollided] = useState(false);

  const santaPhysicsRef = useRef();
  const santaBodyRef = useRef();
  const camera = useThree((state) => state.camera)
  useEffect(() => {

    camera.far = 10000
    camera.fov = 50
    camera.position.set(0, 550, 700)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [])


  
  // Replace keydown handler with click handler
  useEffect(() => {
    const handleClick = () => {
      if (!audioInitialized) {
        setAudioInitialized(true);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [audioInitialized]);

  // Separate effect for game start with spacebar
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


    
    if (keys.forward) {
      currentImpulse.current.z -= .5;
    }
    if (keys.backward) {
      currentImpulse.current.z += .5;
    }
    if (keys.left) {
      currentImpulse.current.x -= .5;
      currentRoll.current -= delta * 2; // Continuously add to roll
      if (santaBodyRef.current) {
        santaBodyRef.current.rotation.y = currentRoll.current;
      }
    }
    if (keys.right) {
      currentImpulse.current.x += .5;
      currentRoll.current += delta * 2; // Continuously subtract from roll
      if (santaBodyRef.current) {
        santaBodyRef.current.rotation.y = currentRoll.current;
      }
    }
    if (!keys.left && !keys.right) {
      currentRoll.current = THREE.MathUtils.lerp(currentRoll.current, 0, delta * 5);
      if (santaBodyRef.current) {
        santaBodyRef.current.rotation.y = currentRoll.current;
      }
    }



    // Lerp impulse back to 0
    currentImpulse.current.x = THREE.MathUtils.lerp(currentImpulse.current.x, 0, delta * 2);
    currentImpulse.current.z = THREE.MathUtils.lerp(currentImpulse.current.z, 0, delta * 2);

    santaPhysicsRef.current.applyImpulse({
      x: currentImpulse.current.x,
      y: 0,
      z: currentImpulse.current.z
    }, true);



    
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

  // Modify collision handler
  const handleCollision = ({ other }) => {
    if (hasCollided) return;
    
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
        <CuboidCollider args={[9, 12, 5]} rotation={[0,degToRad(9),0]} position={[23,0,3]} name="house"/>
        <House
          scale={.15}
          position={[0, 0, 0]}
          roofColor={roofColor}
        />
      </RigidBody>
    </group>
  );
};