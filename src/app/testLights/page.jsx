"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Scene } from "./components/Scene";

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
        <Physics debug={false}>
          <Scene debug />
        </Physics>
      </Canvas>
    </div>
  );
}

