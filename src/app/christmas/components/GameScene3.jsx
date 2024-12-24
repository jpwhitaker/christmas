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
import Santa from './Santa'
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

export function GameScene3({ onPositionUpdate }) {
  const basePosition = [10, 5, 40];
  const sleighRef = useRef(null);

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
      
      <RigidBody type="dynamic" position={[0, 5, 0]} mass={1} colliders={false}>
        <CuboidCollider args={[1, 2.5, 1]} position={[0, 0, 0]} />
        <Santa position={[0, 0, 0]} rotation={[0, degToRad(180),0]} scale={9} />
      </RigidBody>
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








