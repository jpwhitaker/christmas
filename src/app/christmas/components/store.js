import { create } from 'zustand'

export const useSleighStore = create((set) => ({
  sleighState: 'moving', // can be 'moving', 'rest'
  isDragging: false,
  orbitControlsEnabled: true,
  pullbackForce: 0,
  currentScene: 1,
  housesHit: {
    red: false,
    green: false,
    blue: false,
    yellow: false
  },
  hasCollided: false,
  lastCollision: null, // 'floor' or 'house'
  lastHitColor: null, // will store the color of the last hit house
  
  setCurrentScene: (scene) => set({ currentScene: scene }),
  resetForNextAttempt: () => set({
    currentScene: 1,
    hasCollided: false,
    lastCollision: null,
    lastHitColor: null
  }),
  resetGame: () => set({
    currentScene: 1,
    housesHit: {
      red: false,
      green: false,
      blue: false,
      yellow: false
    },
    hasCollided: false,
    lastCollision: null,
    lastHitColor: null
  }),
  setSleighState: (state) => set({ sleighState: state }),
  setIsDragging: (dragging) => set({ 
    isDragging: dragging,
    orbitControlsEnabled: !dragging // disable orbit controls while dragging
  }),
  setPullbackForce: (force) => set({ pullbackForce: force }),
  setHouseHit: (color) => set((state) => ({
    housesHit: {
      ...state.housesHit,
      [color]: true
    },
    lastHitColor: color
  })),
  setHasCollided: (value) => set({ hasCollided: value }),
  setLastCollision: (type) => set({ lastCollision: type }),
}))