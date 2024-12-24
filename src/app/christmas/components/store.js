import { create } from 'zustand'

export const useSleighStore = create((set) => ({
  sleighState: 'moving', // can be 'moving', 'rest'
  isDragging: false,
  orbitControlsEnabled: true,
  pullbackForce: 0,
  housesHit: {
    red: false,
    green: false,
    blue: false,
    yellow: false
  },
  
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
    }
  }))
}))