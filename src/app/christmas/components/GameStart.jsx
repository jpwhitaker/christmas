import localFont from 'next/font/local'
import { Arbutus_Slab } from 'next/font/google'
import { useSleighStore } from './store'
import { HiMiniBackward } from "react-icons/hi2";
import Image from 'next/image';
import { usePlayJingleTrim } from './useAppSounds';
import { LuBadgeInfo } from "react-icons/lu";
import { useState, useEffect } from 'react';


const makawao = localFont({
  src: '../../../../public/christmas/TAYMakawao.woff',
  display: 'swap',
  variable: '--font-makawao',
})

const arbutusSlab = Arbutus_Slab({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const GameStart = ({ showInstructions, setShowInstructions }) => {
  const [playJingleTrim] = usePlayJingleTrim()
  const [showCredits, setShowCredits] = useState(false)

  useEffect(() => {
    if (showInstructions) {
      setShowCredits(false)
    }
  }, [showInstructions])

  return (
    <>
      {showInstructions && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`w-[40rem] bg-white leading-relaxed text-xl text-slate-600 p-8 mx-4 sm:mx-0 rounded-md touch-none relative ${arbutusSlab.className} font-arbutus-slab`}>
            {showCredits ? (
              <CreditText />
            ) : (
              <>
                {Object.values(useSleighStore.getState().housesHit).some(hit => hit)
                  ? <ContinueText />
                  : <GameInstructions />
                }
              </>
            )}
            <div className="flex justify-end">
              <button
                className="bg-white text-slate-600 border-2 border-[#e0ae81] p-2 px-6 rounded-md hover:bg-sky-50"
                onClick={() => {
                  if (showCredits) {
                    setShowCredits(false)
                  } else {
                    setShowInstructions(false)
                    playJingleTrim()
                  }
                }}
              >
                {showCredits ? 'Back' : 'Start'}
              </button>
            </div>
            {!showCredits && !Object.values(useSleighStore.getState().housesHit).some(hit => hit) && (
              <div
                className="text-slate-400 text-sm flex items-center gap-1 cursor-pointer hover:text-slate-500"
                onClick={() => setShowCredits(true)}
              >
                <LuBadgeInfo /> Credits
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default GameStart


const GameInstructions = () => {
  return (
    <>
      <div className={`${makawao.variable} font-makawao text-6xl text-[#e0ae81] mb-2`}>Merry Christmas!</div>
      <div className="mb-6">
        Click and drag the sleigh backwards <HiMiniBackward className="inline-block" />  to launch Santa!
        <br /><br />
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
    </>
  )
}


const ContinueText = () => {
  const housesHit = useSleighStore((state) => state.housesHit);
  const hitHouses = Object.entries(housesHit)
    .filter(([_, isHit]) => isHit)
    .map(([color]) => color);

  const remainingHouses = Object.entries(housesHit)
    .filter(([_, isHit]) => !isHit)
    .map(([color]) => color);

  return (
    <>
      <div className={`${makawao.variable} font-makawao text-6xl text-[#e0ae81] mb-2`}>Keep Going!</div>
      <div className="mb-6">
        You&apos;ve delivered to the {hitHouses.map((color, index) => (
          <span key={color}>
            <span className="capitalize">{color}</span>
            {index === hitHouses.length - 1 ? '' :
              index === hitHouses.length - 2 ? ' and ' :
                ', '}
          </span>
        ))} {hitHouses.length === 1 ? 'house' : 'houses'}!
        <br /><br />
        You still need to visit the {remainingHouses.map((color, index) => (
          <span key={color}>
            <span className="capitalize">{color}</span>
            {index === remainingHouses.length - 1 ? '' :
              index === remainingHouses.length - 2 ? ' and ' :
                ', '}
          </span>
        ))} {remainingHouses.length === 1 ? 'house' : 'houses'}!
      </div>
    </>
  )
}


const CreditText = () => {
  return (
    <>
      <div className="max-h-[400px] overflow-y-auto overflow-x-hidden pr-4 mb-6">
        <div className={`${makawao.variable} font-makawao text-6xl text-[#e0ae81] mb-2`}>Mahalo!</div>
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
    </>
  )
}

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