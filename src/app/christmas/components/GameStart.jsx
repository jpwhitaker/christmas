import localFont from 'next/font/local'
import { Arbutus_Slab } from 'next/font/google'
import { useSleighStore } from './store'
import { HiMiniBackward } from "react-icons/hi2";
import Image from 'next/image';
import { usePlayJingleTrim } from './useAppSounds';

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

  return (
    <>
      {showInstructions && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`w-[40rem] bg-white leading-relaxed text-xl text-slate-600 p-8 mx-4 sm:mx-0 rounded-md touch-none relative ${arbutusSlab.className} font-arbutus-slab`}>
            {Object.values(useSleighStore.getState().housesHit).some(hit => hit)
              ? <ContinueText />
              : <GameInstructions />
            }
            <div className="flex justify-end">
              <button
                className="bg-white text-slate-600 border-2 border-[#e0ae81] p-2 px-6 rounded-md hover:bg-sky-50"
                onClick={() => {
                  setShowInstructions(false)
                  playJingleTrim()
                }}
              >
                Start
              </button>
            </div>
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