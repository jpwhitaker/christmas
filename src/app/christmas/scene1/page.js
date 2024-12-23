"use client";

import { Canvas} from "@react-three/fiber";
import { GameScene1 } from "../components/GameScene1";
import { Physics} from "@react-three/rapier";




export default function Game() {

  return (
    <div className="h-full text-white bg-sky-100  relative">
      <Canvas
      >
        <Physics debug={false}>
          <GameScene1 />
        </Physics>
      </Canvas>
    </div>
  );
}

