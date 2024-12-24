"use client";

import { Canvas} from "@react-three/fiber";
import { GameScene3 } from "../components/GameScene3";
import { Physics} from "@react-three/rapier";




export default function Game() {

  return (
    <div className="h-full text-white bg-sky-100  relative">
      <Canvas
      >
        <Physics debug={true}>
          <GameScene3 />
        </Physics>
      </Canvas>
    </div>
  );
}

