"use client";
import { useRef, useMemo, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Box, Html, Sphere, OrbitControls } from "@react-three/drei";
import { Floor, NoisyTerrain } from "./Floor";
import { Sleigh } from "./Sleigh";
import { RigidBody, CuboidCollider, useSpringJoint, BallCollider } from "@react-three/rapier";
import { useSleighStore } from './store';
import { SantaNoLegs } from "./SantaNoLegs";
import { createNoise2D } from 'simplex-noise';
import * as THREE from 'three';
import { Cabin } from "./Cabin";
import { degToRad } from "three/src/math/MathUtils";
import { Pine } from "./Pine";
import { Snowman } from "./Snowman";
import {BreakableSnowman} from "./BreakableSnowman";
import { easing } from 'maath'
import { useThree } from "@react-three/fiber";
import { usePlayJingleTrim, usePlayOof, usePlaySnowballHit } from './useAppSounds';
import localFont from 'next/font/local'
import Santa from './Santa'
import { Arbutus_Slab } from 'next/font/google'
import { PresentStack } from "./PresentStack";
const makawao = localFont({
  src: '../../../../public/christmas/TAYMakawao.woff',
  display: 'swap',
  variable: '--font-makawao',
})

const arbutusSlab = Arbutus_Slab({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-arbutus-slab',
})

// Add this outside of the Snowball component
const lastSnowballHitTime = { current: 0 };

function Snowball({ position = [0, 0, 0], scale = 1, linearVelocity = [0, 0, 0] }) {
  const [playOof] = usePlayOof();
  const [playSnowballHit] = usePlaySnowballHit();

  const handleCollision = ({ other }) => {
    // Check if we hit Santa
    if (other.rigidBodyObject?.name === 'santa') {
      playOof();
    }
    // Check if we hit other objects with debouncing
    else if (other.rigidBodyObject?.name === 'tree' || 
             other.rigidBodyObject?.name === 'cabin' || 
             other.rigidBodyObject?.name === 'snowman') {
      const now = Date.now();
      if (now - lastSnowballHitTime.current >= 500) { // 1 second debounce
        playSnowballHit();
        lastSnowballHitTime.current = now;
      }
    }
  };

  return (
    <RigidBody 
      type="dynamic" 
      position={position} 
      colliders={false}
      linearVelocity={linearVelocity}
      mass={180}
      enabledTranslations={[true, true, true]}
      ccd={true}
      onCollisionEnter={handleCollision}
    >
      <BallCollider args={[0.5 * scale]} />
      <Sphere args={[0.5, 32, 32]} scale={scale}>
        <meshStandardMaterial color="white" roughness={0.2} />
      </Sphere>
    </RigidBody>
  );
}

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
      
      
      <RigidBody type="fixed" colliders={"trimesh"}>
        <NoisyTerrain />
      </RigidBody>
      
      <RigidBody type="fixed" position={[-7, 3, -50]} rotation={[0, degToRad(30), 0]} name="cabin">
        <CuboidCollider args={[4, 4, 4]} />
        <Cabin scale={8} />
      </RigidBody>

      <SpringySanta />
      <Floor />

      {/* <OrbitControls/> */}
      <RigidBody type="fixed" position={[3, 6, -50]} rotation={[0, degToRad(30), degToRad(-2)]} name="tree">
        <Pine scale={12} />
      </RigidBody>
      <RigidBody type="fixed" position={[-30, 8, -60]} rotation={[0, 0, degToRad(2)]} name="tree">
        <Pine scale={12} />
      </RigidBody>
      <Pine scale={10} position={[30, 5, -80]} rotation={[0, 0, degToRad(2)]} />
      <Pine scale={8} position={[65, 5.5, -145]} rotation={[0, 0, degToRad(2)]} />
      <Pine scale={7} position={[60, 5.5, -150]} rotation={[0, 0, degToRad(2)]} />
      
      {/* <RigidBody type="fixed" position={[10, -0.7, -22]} rotation={[0, degToRad(160), 0]} colliders={false} name="snowman">
        <CuboidCollider args={[1.2, 2.8, 1.2]} />
        <Snowman scale={4} />
      </RigidBody> */}

      <BreakableSnowman position={[10, -0.7, -22]} scale={4} rotation={[0, degToRad(160), 0]} />
      <PresentStack position={[15, 0, 8]} scale={3} rotation={[0, degToRad(-20), 0]} />
      <PresentStack position={[-15, 0.5, -29]} scale={3} rotation={[0, degToRad(30), 0]} />
    </>
  );
}








function SpringySanta() {
  // References to the floor body and Santa body
  const floorRef = useRef(null)
  const santaRef = useRef(null)

  // Mass of Santa (roughly)
  const mass = 1

  // Spring: rest length, stiffness, damping
  const springRestLength = 0.1
  const stiffness = 0.060e3

  // For critical damping: damping = 2 * sqrt(k * m)
  const criticalDamping = 2.0 * Math.sqrt(stiffness * mass)

  // Optionally, you can dial in a ratio of critical damping:
  // e.g. 0.5 * criticalDamping or 1.0 * criticalDamping
  const dampingRatio = 0.7
  const damping = dampingRatio * criticalDamping

  // “Tie” the two bodies together
  useSpringJoint(floorRef, santaRef, [
    // Anchor in floorRef's local space
    [0, 0, 0],
    // Anchor in santaRef's local space
    [0,-2.6, 0],
    // Spring rest length
    springRestLength,
    // Spring stiffness (k)
    stiffness,
    // Spring damping (c)
    damping
  ])

  return (
    <group>
      {/* Floor is a fixed RigidBody */}
      <RigidBody ref={floorRef} type="fixed" position={[0, -1.8, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[5, 0.1, 5]} />
          <meshStandardMaterial color="snow" visible={false} />
        </mesh>
      </RigidBody>

      {/* Santa is a dynamic RigidBody */}
      <RigidBody
        ref={santaRef}
        type="dynamic"
        colliders={false}
        position={[0, 5, 0]}
        name="santa"
      >
        <CuboidCollider args={[1, 2.8, 1]} position={[0, 0, 0]} mass={0.3}/>
        {/* Replace with your Santa model/mesh */}
        <Santa position={[0, 0, 0]} rotation={[0, degToRad(180),0]} scale={9} />
      </RigidBody>
    </group>
  )
}