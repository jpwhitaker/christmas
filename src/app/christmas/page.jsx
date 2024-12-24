"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from 'react';
import { Environment } from "@react-three/drei";
import { GameScene1 } from "./components/GameScene1";
import { GameScene2 } from "./components/GameScene2";
import { Physics } from "@react-three/rapier";
import { BsFillHouseFill } from "react-icons/bs";
import { BsFillHouseHeartFill } from "react-icons/bs";
import { useSleighStore } from "./components/store";
import GameFeedback from "./components/GameFeedback";
const colorClasses = {
  red: "text-red-500",
  green: "text-green-500",
  blue: "text-blue-500",
  yellow: "text-yellow-500"
};



const HouseIcon = ({ color, isHit }) => {
  return (
    isHit ? (
      <BsFillHouseHeartFill className={`h-8 w-8 ${colorClasses[color]}`} />
    ) : (
      <BsFillHouseFill className={`h-8 w-8 ${colorClasses[color]} opacity-30`} />
    )
  );
};

export default function Game() {
  const currentScene = useSleighStore((state) => state.currentScene);
  const setCurrentScene = useSleighStore((state) => state.setCurrentScene);
  const { housesHit } = useSleighStore();
  const [showFeedback, setShowFeedback] = useState(false);
  const hasCollided = useSleighStore((state) => state.hasCollided);

  // Update showFeedback when collision happens
  useEffect(() => {
    if (hasCollided) {
      setShowFeedback(true);
    }
  }, [hasCollided]);

  const handleSceneTransition = (sledPosition) => {
    if (sledPosition.x > 50 && currentScene === 1) {
      setCurrentScene(2);
    }
  };

  return (
    <div className="h-full text-white bg-sky-100 relative">
      <div className="absolute top-4 right-4 w-1/4 bg-white text-black rounded-lg p-4 z-10">
        <div className="flex justify-between">
          <HouseIcon color="red" isHit={housesHit.red} />
          <HouseIcon color="green" isHit={housesHit.green} />
          <HouseIcon color="blue" isHit={housesHit.blue} />
          <HouseIcon color="yellow" isHit={housesHit.yellow} />
        </div>
      </div>

      <GameFeedback 
        showFeedback={showFeedback} 
        setShowFeedback={setShowFeedback}
      />

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

