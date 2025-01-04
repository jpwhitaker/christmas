import { Cone } from '@react-three/drei'

export default function PineLow({ position = [0, 0, 0], scale = 1 }) {
  return (
    <Cone 
      args={[1, 3, 8]} // radius, height, segments
      position={position}
      scale={scale}
    >
      <meshStandardMaterial color="#26aba6" />
    </Cone>
  )
}
