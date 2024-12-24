"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { GameScene1 } from "./components/GameScene1";
import { GameScene2 } from "./components/GameScene2";
import { Physics } from "@react-three/rapier";
import { useState } from 'react';
import { BsFillHouseFill } from "react-icons/bs";
import { BsFillHouseHeartFill } from "react-icons/bs";



export default function Game() {
  const [currentScene, setCurrentScene] = useState(1);

  const handleSceneTransition = (sledPosition) => {
    if (sledPosition.x > 50 && currentScene === 1) {
      setCurrentScene(2);
    }
  };

  return (
    <div className="h-full text-white bg-sky-100 relative">
      <div className="absolute top-4 right-4 w-1/4 bg-white text-black rounded-lg p-4 z-10">
        <div className="flex justify-between">
          <BsFillHouseFill className="h-8 w-8 text-red-500" />
          <BsFillHouseFill className="h-8 w-8 text-green-500" />
          <BsFillHouseFill className="h-8 w-8 text-blue-500" />
          <BsFillHouseHeartFill className="h-8 w-8 text-yellow-500 opacity-30" />
        </div>
      </div>

      <Canvas shadows={true}>
        <Physics debug={false}>
          {currentScene === 1 ? (
            <GameScene1 onPositionUpdate={handleSceneTransition} />
          ) : (
            <GameScene2 />
          )}
        </Physics>
      </Canvas>
    </div>
  );
}

