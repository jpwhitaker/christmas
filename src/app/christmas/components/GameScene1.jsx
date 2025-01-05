"use client";
import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment} from "@react-three/drei";
import { Floor, NoisyTerrain } from "./terrain/Floor";
import { Sleigh } from "./player/Sleigh";
import { Present } from "./interactable/Present";
import { RigidBody, CuboidCollider, useRevoluteJoint } from "@react-three/rapier";
import { useSleighStore } from './store';
import { SantaNoLegs } from "./player/SantaNoLegs";
import { Cabin } from "./scenery/Cabin";
import { degToRad } from "three/src/math/MathUtils";
import { Pine } from "./scenery/Pine";
import { Snowman } from "./scenery/Snowman";
import { easing } from 'maath'
import { useThree } from "@react-three/fiber";
import { usePlayJingleTrim } from './useAppSounds';
import localFont from 'next/font/local'
import Image from 'next/image';
import { Arbutus_Slab } from 'next/font/google'
import { HiMiniBackward } from "react-icons/hi2";


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
        <Present scale={4.5} position={[0, 1, -1.8]}/>
      </RigidBody>

      <RigidBody
        ref={santaRef}
        colliders={false}
        position={[0, 1, 0]}
        mass={1}
      >
        <CuboidCollider args={[0.4, 0.8, 0.4]} position={[-0.1, 1, 0]} mass={1} />
        <SantaNoLegs scale={4} position={[0, 1, 0]} rotation={[0, -Math.PI, 0]} />
      </RigidBody>
    </group>
  );
});
SantaInSleigh.displayName = 'SantaInSleigh';

