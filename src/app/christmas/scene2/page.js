"use client";

import { Canvas } from "@react-three/fiber";
import { GameScene2 } from "../components/GameScene2";
import { Physics} from "@react-three/rapier";
import { usePlaySplat, usePlayJingleTrim, usePlayPerfect } from '../components/useAppSounds';




export default function Game() {
  const [playSplat] = usePlaySplat()
  return (
    <div className="h-full text-white bg-sky-100  relative">
      <Canvas shadows={true} >
        <Physics debug={false}>
          <GameScene2 />
        </Physics>
      </Canvas>
    </div>
  );
}

