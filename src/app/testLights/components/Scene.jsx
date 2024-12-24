"use client";
import { useRef, useMemo, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Box, Html, OrbitControls, Cloud, useHelper } from "@react-three/drei";
import { Floor, NoisyTerrain } from "../../christmas/components/Floor";
import { Cabin } from "../../christmas/components/Cabin";
import { degToRad } from "three/src/math/MathUtils";
import { Pine } from "../../christmas/components/Pine";
import { Snowman } from "../../christmas/components/Snowman";
import { easing } from 'maath'
import { useThree } from "@react-three/fiber";
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
import { MeshStandardMaterial } from "three";
import { CloudWithLights } from "./CloudWithLights";




export function Scene() {
  const spotLightRef = useRef()
  // useHelper(spotLightRef, SpotLightHelper) // optional, for debugging

  useEffect(() => {
    RectAreaLightUniformsLib.init()
  }, [])

  useThree(({ camera }) => {
    camera.fov = 50;
    camera.position.set(0, 30, 10);
    camera.lookAt(0, 30, -100);
    camera.updateProjectionMatrix();
  });


  return (
    <>
      {/* <spotLight
        ref={spotLightRef}
        position={[0, 26, 0]}
        intensity={100}
        angle={Math.PI / 4}
        penumbra={0.1}
        color="#ffffff"
      /> */}
      <CloudWithLights position={[0, 20, 0]} scale={1} />
      <Environment preset="dawn" background={false} environmentIntensity={1} />
      <fog attach="fog" args={["#e0f2fe", 20, 350]} />
      <OrbitControls target={[0, 30, -100]} />
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








