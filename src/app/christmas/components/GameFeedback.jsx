import localFont from 'next/font/local'
import { useSleighStore } from './store'

const makawao = localFont({
  src: '../../../../public/christmas/TAYMakawao.woff',
  display: 'swap',
  variable: '--font-makawao',
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
    "Try to hit another house!" :
    lastCollision === 'house' ?
    `Awesome, you delivered presents to the ${lastHitColor} house!` :
    allHousesHit ? 
    "Great job! You delivered to all the houses!" : 
    "Try to hit another house!";

  const headingMessage = lastCollision === 'floor' ? 'Splat!' : 'Perfect!';

  const handleTryAgain = () => {
    setShowFeedback(false);
    resetForNextAttempt();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="w-[40rem] bg-white text-xl text-black p-8 rounded-md">
        <span className={`${makawao.variable} font-makawao text-6xl text-[#e0ae81]`}>
          {headingMessage}
        </span>
        <br /><br />
        {message}
        <div className="flex justify-end">
          <button
            className="bg-white text-black border-2 border-[#e0ae81] p-2 px-6 rounded-md hover:bg-sky-50"
            onClick={handleTryAgain}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameFeedback