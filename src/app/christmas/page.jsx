"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from 'react';
import { GameScene1 } from "./components/GameScene1";
import { GameScene2 } from "./components/GameScene2";
import { GameScene3 } from "./components/GameScene3";
import { Physics } from "@react-three/rapier";
import { useSleighStore } from "./components/store";
import { EndInstructions } from "./components/ui/EndInstructions";
import { Score } from "./components/ui/Score";
import { Cheats } from "./components/ui/Cheats";
import { Modal } from "./components/ui/Modal";

export default function Game() {
  const currentScene = useSleighStore((state) => state.currentScene);
  const setCurrentScene = useSleighStore((state) => state.setCurrentScene);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const isModalOpen = useSleighStore((state) => state.isModalOpen);
  const setIsModalOpen = useSleighStore((state) => state.setIsModalOpen);
  const hasCollided = useSleighStore((state) => state.hasCollided);
  const resetGame = useSleighStore((state) => state.resetGame);

  // Update showFeedback when collision happens
  useEffect(() => {
    if (hasCollided) {
      setShowFeedback(true);
    }
  }, [hasCollided]);

  const handleSceneTransition = (sledPosition) => {
    const threshold = 50;
    if (currentScene === 1 && (
      Math.abs(sledPosition.x) > threshold ||
      Math.abs(sledPosition.y) > threshold ||
      Math.abs(sledPosition.z) > threshold
    )) {
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
    if (currentScene === 1) {
      setShowInstructions(true);
    }
  }, [currentScene]);

  return (
    <div className="h-screen text-white bg-sky-100 relative">
      <Score />
      <Cheats 
        setShowInstructions={setShowInstructions}
        setCurrentScene={setCurrentScene}
        setIsModalOpen={setIsModalOpen}
      />
      
      <EndInstructions
        currentScene={currentScene}
        resetGame={resetGame}
        setCurrentScene={setCurrentScene}
      />

      <Modal
        isOpen={isModalOpen}
      />

      <Canvas shadows={true}>
        <Physics debug={false} timeStep={currentScene === 2 ? "vary" : 1/60}>
          {renderScene()}
        </Physics>
      </Canvas>
    </div>
  );
}

