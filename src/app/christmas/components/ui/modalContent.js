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
      showCreditsButton: true,
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
      content: 
      <>
      <div className="max-h-[400px] overflow-y-scroll -mr-4 pr-4 mb-6">
        <div className="text-base">
          Made by JP Whitaker over the course of 4 sleepless days. I&apos;m looking for a job if you&apos;re hiring!
          <br /><br />
          Thanks to all the creators and contributors to Three.js, React Three Fiber, and Drei.
          <br /><br />
          Also shout out to Bruno Simon, Wawa Sensei, and Shawn Drost for teaching me how to code!
          <br /><br />
          Contact me: <a href="https://www.linkedin.com/in/captainwhitaker/" target="_blank" rel="noopener noreferrer" className="text-[#e0ae81] hover:text-blue-800 underline">https://www.linkedin.com/in/captainwhitaker/</a>
          <br /><br />
        </div>
        <div>
          Models:
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-200">
              {ModelData.map((model, index) => (
                <tr key={index} className="py-2">
                  <td className="font-semibold py-2 pr-4 align-top whitespace-nowrap">{model.name}</td>
                  <td className="py-2 break-all">{model.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          Sounds:
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-200">
              {SoundData.map((sound, index) => (
                <tr key={index} className="py-2">
                  <td className="font-semibold py-2 pr-4 align-top whitespace-nowrap">{sound.name}</td>
                  <td className="py-2 break-all">{sound.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>,
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

const ModelData = [
  {
    name: 'Santa',
    info: 'Surprised Santa by Matt Connors [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/3Q7goR4wcNE)'
  },
  {
    name: "Cabin",
    info: "Christmas Cabin by Jakers_H [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/2EJuFq6kjTK)"
  },
  {
    name: "Tree",
    info: "Pine Tree with Snow by Chris Lee [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/3pWKPFASEn-)"
  },
  {
    name: "Snowman",
    info: "Snowman by Carlos Sanchez Witt [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/cKYkfU3kdWC)"
  },
  {
    name: "Sleigh",
    info: "Sleigh by WilliamJ99 via TurboSquid (https://www.turbosquid.com/3d-models/sleigh-3d-model-1661225) "
  },
  {
    name: "Present",
    info: "Present by CreativeTrio (https://poly.pizza/m/LVg3ynJDxa)"
  },
  {
    name: "House",
    info: "House by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/6PGyqELX8M-)"
  }
]

const SoundData = [
  {
    name: "Jingle Bell Rock (Instrumental Version)",
    info: "https://www.youtube.com/watch?v=QDfszrySPWw"
  },
  {
    name: "Splat",
    info: "https://www.youtube.com/watch?v=KUOfNtoJyLw"
  },
  {
    name: "PERFECT SOUND EFFECT (STREET FIGHTER)",
    info: "https://www.youtube.com/watch?v=Q2KIHur0-_E"
  },
  {
    name: "Skydive Parachute Glide Wind Loop Sound Effect",
    info: "https://www.youtube.com/watch?v=zwvFzXoi6C4"
  },
  {
    name: "Ouch Oof Hurt Sound Effect, Homemade_SFX",
    info: "https://pixabay.com/users/homemade_sfx-47000485/"
  },
  {
    name: "Snowball Hit 01, Alex_Jauk",
    info: "https://pixabay.com/users/alex_jauk-16800354/"
  }
]