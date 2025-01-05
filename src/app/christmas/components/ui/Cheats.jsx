import { useEffect } from 'react';
import { useSleighStore } from '../store';

export const Cheats = ({ setShowInstructions, setCurrentScene, setIsModalOpen }) => {

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '3') {
        useSleighStore.getState().setMultipleHouses({
          red: true,
          green: true,
          blue: true
        });
      }
      if (event.key === '4') {
        useSleighStore.getState().setMultipleHouses({
          red: true,
          green: true,
          blue: true,
          yellow: true
        });
        setShowInstructions(false);
        setIsModalOpen(false);
        setCurrentScene(3);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setShowInstructions, setCurrentScene]);

  return null;
}; 