"use client";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { Environment, Box, CameraControls, OrbitControls } from "@react-three/drei";
import { NoisyTerrain } from "./FloorHuge.jsx";
import { degToRad } from "three/src/math/MathUtils";
import { Pine } from "./Pine.jsx";
import { CloudWithLights } from "../../testLights/components/CloudWithLights";
import Santa from "./Santa.jsx";
import { RigidBody } from "@react-three/rapier";
import { CuboidCollider } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { KeyboardControls, useKeyboardControls, Cloud } from '@react-three/drei'
import { Vector3 } from "three";
import { ColliderHouse } from "./ColliderHouse.jsx";
import { FallingSanta } from "./FallingSanta.jsx";
import { SunDirectionalLight } from "./SunDirectionalLight.jsx";
import PineForest from "./PineForest.jsx";

export function GameScene2() {
  return (
    <>
      <SunDirectionalLight />
      <Environment preset="dawn" background={false} environmentIntensity={0.6} />
      <fog attach="fog" args={["#e0f2fe", 600, 2000]} />
      <KeyboardControls map={[
        { name: 'forward', keys: ['ArrowUp', 'w'] },
        { name: 'backward', keys: ['ArrowDown', 's'] },
        { name: 'left', keys: ['ArrowLeft', 'a'] },
        { name: 'right', keys: ['ArrowRight', 'd'] },
      ]}>
        <FallingSanta />
      </KeyboardControls>
      <RigidBody type="fixed" position={[0, 0, 0]} name="noisyTerrain">
        <NoisyTerrain position={[0, 0, 0]} />
      </RigidBody>

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

      <PineForest 
  seed={12345}
  innerRadius={200}
  outerRadius={1000}
  density={0.0002} // Adjust this to control number of trees
/>



    </>
  );
}




