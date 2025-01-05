import { Arbutus_Slab } from 'next/font/google'

const arbutusSlab = Arbutus_Slab({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export function EndInstructions({ currentScene, resetGame, setCurrentScene }) {
  if (currentScene !== 3) return null;
  
  return (
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
  );
} 