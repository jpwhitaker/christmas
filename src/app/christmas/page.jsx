"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from 'react';
import { Environment } from "@react-three/drei";
import { GameScene1 } from "./components/GameScene1";
import { GameScene2 } from "./components/GameScene2";
import { GameScene3 } from "./components/GameScene3";
import { Physics } from "@react-three/rapier";
import { BsFillHouseFill } from "react-icons/bs";
import { BsFillHouseHeartFill } from "react-icons/bs";
import { useSleighStore } from "./components/store";
import GameFeedback from "./components/GameFeedback";
import { Arbutus_Slab } from 'next/font/google'

const arbutusSlab = Arbutus_Slab({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

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
  const resetGame = useSleighStore((state) => state.resetGame);

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

  const renderScene = () => {
    switch (currentScene) {
      case 1:
        return <GameScene1 onPositionUpdate={handleSceneTransition} />;
      case 2:
        return <GameScene2 />;
      case 3:
        return <GameScene3 />;
      default:
        return <GameScene1 onPositionUpdate={handleSceneTransition} />;
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '3') {
        useSleighStore.getState().setMultipleHouses({
          red: true,
          green: true,
          blue: true
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

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

      {currentScene === 3 && (
        <div className="absolute bottom-4 right-4 flex flex-row-reverse items-center gap-4 select-none">
          <button
            onClick={() => {
              resetGame();
              setCurrentScene(1);
            }}
            className={`bg-white font-black text-slate-600 border-2 border-[#e0ae81] p-2 px-6 rounded-md hover:bg-sky-50 z-10 ${arbutusSlab.className}`}
          >
            Play again?
          </button>
          <p className={`text-slate-700 font-semibold z-10 mr-6 ${arbutusSlab.className}`}>
            Click anywhere to throw a snowball!
          </p>
        </div>
      )}

      <GameFeedback 
        showFeedback={showFeedback} 
        setShowFeedback={setShowFeedback}
      />

      <Canvas shadows={true}>
        <Physics debug={false}>
          {renderScene()}
        </Physics>
      </Canvas>
    </div>
  );
}

