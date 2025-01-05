// modalContent.jsx
import { useSleighStore } from '../store';
import { usePlayJingleTrim } from '../useAppSounds';
import { colorClasses, bgColorClasses } from './Score';
import { HiMiniBackward } from "react-icons/hi2";
import { LuBadgeInfo } from "react-icons/lu";
import Image from 'next/image';

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
        <div className="mb-12">
        Click and drag the sleigh backwards <HiMiniBackward className="inline-block" />  to launch Santa!

        Then use the arrow keys
        <span className="mx-2 inline-flex text-slate-600">
          <Image
            src="/christmas/arrowkeys.svg"
            alt="arrow keys"
            width={62}
            height={62}
            className="translate-y-2 [filter:invert(47%)_sepia(5%)_saturate(1111%)_hue-rotate(176deg)_brightness(91%)_contrast(87%)]"
          />
        </span>
        to aim him towards the houses to deliver the presents!
      </div>
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
      <div className="mb-4">
        You&apos;ve delivered to the {Object.entries(housesHit)
          .filter(([_, hit]) => hit)
          .map(([color]) => (
            <span key={color} className={`${bgColorClasses[color]} text-white text-sm px-2 py-1 rounded-md mx-0.5`}>
              {color}
            </span>
          ))
          .reduce((acc, element, index, array) => {
            if (index === 0) return element;
            if (index === array.length - 1) return <>{acc} and {element}</>;
            return <>{acc}, {element}</>;
          }, '')} {Object.entries(housesHit).filter(([_, hit]) => hit).length === 1 ? 'house' : 'houses'},
        </div>
        <div className="mb-12">
        you still need to visit the {Object.entries(housesHit)
          .filter(([_, hit]) => !hit)
          .map(([color]) => (
            <span key={color} className={`${bgColorClasses[color]} text-white text-sm px-2 py-1 rounded-md mx-0.5`}>
              {color}
            </span>
          ))
          .reduce((acc, element, index, array) => {
            if (index === 0) return element;
            if (index === array.length - 1) return <>{acc} and {element}</>;
            return <>{acc}, {element}</>;
          }, '')} {Object.entries(housesHit).filter(([_, hit]) => !hit).length === 1 ? 'house' : 'houses'}.
        </div>
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
      content: <>
        <div className="mb-12">
        Awesome, you delivered presents to the{' '}
        <span className={`${bgColorClasses[lastHitColor]} text-white text-sm px-2 py-1 rounded-md mx-0.5`}>
          {lastHitColor}
        </span> house!
        </div>
      </>,
      closeButtonText: "Next Delivery",
      onClose: resetForNextAttempt
    },
    [MODAL_TYPES.COMPLETE]: {
      title: "Perfect!",
      content: <div className="mb-12">
        You&apos;ve delivered all the presents, thank you Santa!
      </div>,
      closeButtonText: "Celebrate!",
      onClose: () => {
        setCurrentScene(3);
        closeModal();
      }
    }
  };
};