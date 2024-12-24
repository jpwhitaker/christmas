import localFont from 'next/font/local'
import { Arbutus_Slab } from 'next/font/google'
import { useSleighStore } from './store'

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

const GameFeedback = ({ showFeedback, setShowFeedback }) => {
  const hasCollided = useSleighStore((state) => state.hasCollided);
  const housesHit = useSleighStore((state) => state.housesHit);
  const lastCollision = useSleighStore((state) => state.lastCollision);
  const lastHitColor = useSleighStore((state) => state.lastHitColor);
  const resetForNextAttempt = useSleighStore((state) => state.resetForNextAttempt);

  // Only show feedback if we've collided
  if (!hasCollided) return null;

  const allHousesHit = Object.values(housesHit).every(hit => hit);
  const message = lastCollision === 'floor' ? 
    "Try to land on the house!" :
    lastCollision === 'house' ?
      allHousesHit ? 
    `You've delivered all the presents, thank you Santa!` :
      `Awesome, you delivered presents to the ${lastHitColor} house!` :
    "";

  const headingMessage = lastCollision === 'floor' ? 'Splat!' : 'Perfect!';

  const handleTryAgain = () => {
    setShowFeedback(false);
    resetForNextAttempt();
  };

  const buttonText = lastCollision === 'floor' ? 
    'Try Again?' :
    allHousesHit ? 
    'Celebrate!' : 
    'Next Delivery!';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
      <div className={`w-[40rem] bg-white/70 backdrop-blur-sm text-xl text-slate-600 p-8 rounded-md ${arbutusSlab.className}`}>
        <div className={`${makawao.variable} font-makawao text-6xl mb-2 text-[#e0ae81]`}>
          {headingMessage}
        </div>
        <div className="mb-6">
          {message}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-white text-slate-600 border-2 border-[#e0ae81] p-2 px-6 rounded-md hover:bg-sky-50"
            onClick={handleTryAgain}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameFeedback