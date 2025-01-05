// modalContent.jsx
import { useSleighStore } from '../store';
import { usePlayJingleTrim } from '../useAppSounds';

export const MODAL_TYPES = {
  START: 'start',
  PROGRESS: 'progress',
  CREDITS: 'credits',
  MISS: 'miss',
  HIT: 'hit',
  COMPLETE: 'complete'
};

export const useModalContent = () => {
  const { startGame, housesHit, lastHitColor, resetForNextAttempt, resetGame, closeModal, setCurrentScene } = useSleighStore();
  const [playJingleTrim] = usePlayJingleTrim();
  
  return {
    [MODAL_TYPES.START]: {
      title: "Merry Christmas!",
      content: <>
        Click and drag the sleigh backwards to launch Santa!
        <br />
        Then use the arrow keys to aim him towards the houses to deliver the presents!
      </>,
      closeButtonText: "Start",
      showCreditsButton: false,
      onClose: () => {
        playJingleTrim();
        startGame();
      }
    },
    [MODAL_TYPES.PROGRESS]: {
      title: "Keep Going!",
      content: <>
        You've delivered to the {Object.entries(housesHit)
          .filter(([_, hit]) => hit)
          .map(([color]) => color)
          .join(', ')} house!
        <br />
        You still need to visit the {Object.entries(housesHit)
          .filter(([_, hit]) => !hit)
          .map(([color]) => color)
          .join(', ')} house!
      </>,
      closeButtonText: "Continue",
      onClose: () => {
        playJingleTrim();
        closeModal();
      }
    },
    [MODAL_TYPES.CREDITS]: {
      title: "Mahalo!",
      content: "Made by JP Whitaker over the course of 4 sleepless days. I'm looking for a job if you're hiring!",
      closeButtonText: "Back",
      // onClose will be set in Modal component for credits
    },
    [MODAL_TYPES.MISS]: {
      title: "Ouch!",
      content: "Try to land on the house!",
      closeButtonText: "Try Again?",
      onClose: resetForNextAttempt
    },
    [MODAL_TYPES.HIT]: {
      title: "Perfect!",
      content: `Awesome, you delivered presents to the ${lastHitColor} house!`,
      closeButtonText: "Next Delivery",
      onClose: resetForNextAttempt
    },
    [MODAL_TYPES.COMPLETE]: {
      title: "Perfect!",
      content: "You've delivered all the presents, thank you Santa!",
      closeButtonText: "Celebrate!",
      onClose: () => {
        setCurrentScene(3);
        closeModal();
      }
    }
  };
};