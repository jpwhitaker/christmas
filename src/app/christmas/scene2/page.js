"use client";

import { Canvas } from "@react-three/fiber";
import { GameScene2 } from "../components/GameScene2";
import { Physics} from "@react-three/rapier";




export default function Game() {

  return (
    <div className="h-full text-white bg-sky-100  relative">
      <Canvas
      >
        <Physics debug={false}>
          <GameScene2 />
        </Physics>
      </Canvas>
    </div>
  );
}

