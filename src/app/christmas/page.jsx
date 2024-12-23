"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { GameScene1 } from "./components/GameScene1";
import { GameScene2 } from "./components/GameScene2";
import { Physics } from "@react-three/rapier";
import { useState } from 'react';

export default function Game() {
  const [currentScene, setCurrentScene] = useState(1);

  const handleSceneTransition = (sledPosition) => {
    if (sledPosition.x > 50 && currentScene === 1) {
      setCurrentScene(2);
    }
  };

  return (
    <div className="h-full text-white bg-sky-100 relative">
      <Canvas>
        <Physics debug={true}>
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

