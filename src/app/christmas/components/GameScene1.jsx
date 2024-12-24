"use client";
import { useRef, useMemo, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Box, Html } from "@react-three/drei";
import { Floor, NoisyTerrain } from "./Floor";
import { Sleigh } from "./Sleigh";
import { RigidBody, CuboidCollider, useRevoluteJoint } from "@react-three/rapier";
import { useSleighStore } from './store';
import { SantaNoLegs } from "./SantaNoLegs";
import { createNoise2D } from 'simplex-noise';
import * as THREE from 'three';
import { Cabin } from "./Cabin";
import { degToRad } from "three/src/math/MathUtils";
import { Pine } from "./Pine";
import { Snowman } from "./Snowman";
import { easing } from 'maath'
import { useThree } from "@react-three/fiber";
import { usePlayJingleTrim } from './useAppSounds';
import localFont from 'next/font/local'
import Image from 'next/image';
import { Arbutus_Slab } from 'next/font/google'

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

export function GameScene1({ onPositionUpdate }) {
  const [playJingleTrim] = usePlayJingleTrim()
  const basePosition = [10, 5, 40];
  const sleighRef = useRef(null);
  const [showInstructions, setShowInstructions] = useState(true);

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

  return (
    <>
      {showInstructions && (
        <Html position={[10, 0, 0]} center args={[10, 10]}>
          <div className={`h-full w-[40rem] bg-white leading-relaxed text-xl text-slate-600 p-8 rounded-md touch-none relative ${arbutusSlab.className} font-arbutus-slab`}>
            {Object.values(useSleighStore.getState().housesHit).some(hit => hit) 
              ? <ContinueText />
              : <GameInstructions />
            }
            <div className="flex justify-end">
              <button
                className="bg-white text-slate-600 border-2 border-[#e0ae81] p-2 px-6 rounded-md hover:bg-sky-50"
                onClick={() => {
                  setShowInstructions(false)
                  playJingleTrim()
                }}
              >
                Start
              </button>
            </div>
          </div>
        </Html>
      )}
      <Environment preset="dawn" background={false} environmentIntensity={1} />
      <fog attach="fog" args={["#e0f2fe", 20, 350]} />
      <SantaInSleigh ref={sleighRef} />
      <NoisyTerrain />
      <Cabin scale={8} position={[-7, 3, -50]} rotation={[0, degToRad(30), 0]} />
      <Floor />
      <Pine scale={12} position={[3, 6, -50]} rotation={[0, degToRad(30), degToRad(-2)]} />
      <Pine scale={12} position={[-30, 8, -60]} rotation={[0, 0, degToRad(2)]} />
      <Pine scale={10} position={[30, 5, -80]} rotation={[0, 0, degToRad(2)]} />
      <Pine scale={8} position={[65, 5.5, -145]} rotation={[0, 0, degToRad(2)]} />
      <Pine scale={7} position={[60, 5.5, -150]} rotation={[0, 0, degToRad(2)]} />
      <Snowman scale={4} position={[10, -0.7, -22]} rotation={[0, degToRad(160), 0]} />
    </>
  );
}

const SantaInSleigh = forwardRef((props, ref) => {
  const santaRef = useRef(null);
  const sleighRef = useRef(null);
  const { setSleighState, setIsDragging, setPullbackForce, isDragging } = useSleighStore();

  const startPositionRef = useRef(null);

  useRevoluteJoint(sleighRef, santaRef, [
    [-0.5, 0.9, -0.2],
    [-0.5, 0, 0],
    [1, 0, 0]
  ]);

  // Forward the sleighRef to the parent component
  useImperativeHandle(ref, () => sleighRef.current);

  const handlePointerDown = () => {
    if (!sleighRef.current) return;
    setIsDragging(true);
    startPositionRef.current = sleighRef.current.translation().x;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (event) => {
    if (!sleighRef.current) return;

    const movementX = event.movementX * 0.05;
    const currentPosition = sleighRef.current.translation();

    // Restrict to backward movement only (negative X direction)
    const newX = currentPosition.x + movementX;
    const pullbackLimit = startPositionRef.current - 10;
    const forwardLimit = startPositionRef.current;

    // Only allow movement if it's going backward (newX <= forwardLimit) 
    // and not beyond the pullback limit
    if (newX >= pullbackLimit && newX <= forwardLimit) {
      sleighRef.current.setTranslation({
        x: newX,
        y: currentPosition.y,
        z: currentPosition.z
      });

      // Calculate and store force
      const force = Math.min(100, Math.max(0,
        ((startPositionRef.current - newX) / 10) * 100
      ));
      setPullbackForce(force);
    }
  };

  const handlePointerUp = () => {
    if (!sleighRef.current) return;
    setIsDragging(false);
    const force = useSleighStore.getState().pullbackForce;

    // Apply force in the forward direction
    const forceMultiplier = 50;
    sleighRef.current.applyImpulse({ x: force * forceMultiplier, y: 0, z: 0 });

    // Reset the pullback force
    setPullbackForce(0);

    console.log(`Launching sleigh with force: ${force.toFixed(1)}%`);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  return (
    <group position={[0, 0, 0]}>
      <RigidBody
        ref={sleighRef}
        type="dynamic"
        colliders={false}
        rotation={[0, Math.PI / 2, 0]}
        onPointerDown={handlePointerDown}
      >
        <CuboidCollider
          args={[1, 0.45, 2.5]}
          position={[0, 0.5, -0.6]}
          mass={90}
        />
        <Sleigh />
      </RigidBody>

      <RigidBody
        ref={santaRef}
        colliders={false}
        position={[0, 1, 0]}
        mass={1}
      >
        <CuboidCollider args={[0.5, 0.8, 0.5]} position={[-0.1, 1, 0]} mass={1} />
        <SantaNoLegs scale={4} position={[0, 1, 0]} rotation={[0, -Math.PI, 0]} />
      </RigidBody>
    </group>
  );
});
SantaInSleigh.displayName = 'SantaInSleigh';






const GameInstructions = () => {
  return (
    <>
      <div className={`${makawao.variable} font-makawao text-6xl text-[#e0ae81] mb-2`}>Merry Christmas!</div>
      <div className="mb-6">
        Click and drag the sleigh to launch Santa!
        <br /><br />
        Then use the arrow keys
        <span className="mx-2 inline-flex text-slate-600">
          <Image
            src="/christmas/arrowkeys.svg"
            alt="arrow keys"
            width={62}
            height={62}
            className="translate-y-2 [filter:invert(47%)_sepia(5%)_saturate(1111%)_hue-rotate(176deg)_brightness(91%)_contrast(87%)]"
          />
        </span>
        to aim him towards the houses to deliver the presents!
      </div>
    </>
  )
}


const ContinueText = () => {
  const housesHit = useSleighStore((state) => state.housesHit);
  const hitHouses = Object.entries(housesHit)
    .filter(([_, isHit]) => isHit)
    .map(([color]) => color);
  
  const remainingHouses = Object.entries(housesHit)
    .filter(([_, isHit]) => !isHit)
    .map(([color]) => color);

  return (
    <>
      <div className={`${makawao.variable} font-makawao text-6xl text-[#e0ae81] mb-2`}>Keep Going!</div>
      <div className="mb-6">
        You&apos;ve delivered to the {hitHouses.map((color, index) => (
          <span key={color}>
            <span className="capitalize">{color}</span>
            {index === hitHouses.length - 1 ? '' : 
             index === hitHouses.length - 2 ? ' and ' : 
             ', '}
          </span>
        ))} {hitHouses.length === 1 ? 'house' : 'houses'}!
        <br /><br />
        You still need to visit the {remainingHouses.map((color, index) => (
          <span key={color}>
            <span className="capitalize">{color}</span>
            {index === remainingHouses.length - 1 ? '' : 
             index === remainingHouses.length - 2 ? ' and ' : 
             ', '}
          </span>
        ))} {remainingHouses.length === 1 ? 'house' : 'houses'}!
      </div>
    </>
  )
}
