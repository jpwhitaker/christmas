"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { GameScene1 } from "./components/GameScene1";
import { GameScene2 } from "./components/GameScene2";
import { Physics} from "@react-three/rapier";




export default function Game() {

  return (
    <div className="h-full text-white bg-sky-100  relative"

    >
      <Canvas
        
      >
        <Physics debug={true}>
          <GameScene1 />
        </Physics>
      </Canvas>
    </div>
  );
}

