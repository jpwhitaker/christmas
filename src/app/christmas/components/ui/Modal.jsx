import { useState } from 'react';
import { Arbutus_Slab } from 'next/font/google';
import localFont from 'next/font/local';
import { useSleighStore } from '../store';
import { MODAL_TYPES, useModalContent } from './modalContent';

const arbutusSlab = Arbutus_Slab({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const makawao = localFont({
  src: '../../../../../public/christmas/TAYMakawao.woff',
  display: 'swap',
  variable: '--font-makawao',
});

const Button = ({ onClick, className, children }) => (
  <button
    className={`
      relative
      overflow-hidden
      bg-white text-slate-600 
      border-2 border-[#e0ae81] 
      p-2 px-6 rounded-md
      group
      ${className || ''}
    `}
    onClick={onClick}
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-sky-50 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
  </button>
);

export const Modal = ({ isOpen }) => {
  const [showingCredits, setShowingCredits] = useState(false);
  const modalType = useSleighStore((state) => state.modalType);
  const modalContent = useModalContent();

  if (!isOpen) return null;

  const currentContent = showingCredits 
    ? modalContent[MODAL_TYPES.CREDITS]
    : modalContent[modalType];
  
  const handleClose = () => {
    if (showingCredits) {
      setShowingCredits(false);
    } else {
      currentContent.onClose?.();
    }
  };

  const isTransparent = modalType === MODAL_TYPES.MISS || modalType === MODAL_TYPES.HIT;

  return (
    <div className={`
      fixed inset-0 flex items-center justify-center z-50
    `}>
      <div className={`
        w-[40rem] 
        ${isTransparent ? 'bg-white/70 backdrop-blur-sm' : 'bg-white'} 
        leading-relaxed 
        text-xl 
        text-slate-600 
        p-8 
        mx-4 
        sm:mx-0 
        rounded-md 
        touch-none 
        relative 
        ${arbutusSlab.className}
      `}>
        <div className={`${makawao.variable} font-makawao text-6xl text-[#e0ae81] mb-6`}>
          {currentContent.title}
        </div>
        <div className="whitespace-pre-line">
          {currentContent.content}
        </div>
        <div className="flex justify-end mt-6">
          {currentContent.showCreditsButton && (
            <button
              className="text-[#e0ae81] hover:text-[#c99b72] underline mr-4"
              onClick={() => setShowingCredits(true)}
            >
              Credits
            </button>
          )}
          <Button onClick={handleClose}>
            {currentContent.closeButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};