import { useRef } from "react";
import { RigidBody, CuboidCollider, useSpringJoint } from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils";
import Santa from './Santa';

export function SpringySanta() {
  const floorRef = useRef(null)
  const santaRef = useRef(null)

  const mass = 1
  const springRestLength = 0.1
  const stiffness = 0.060e3
  const criticalDamping = 2.0 * Math.sqrt(stiffness * mass)
  const dampingRatio = 0.7
  const damping = dampingRatio * criticalDamping

  useSpringJoint(floorRef, santaRef, [
    [0, 0, 0],
    [0,-2.6, 0],
    springRestLength,
    stiffness,
    damping
  ])

  return (
    <group>
      <RigidBody ref={floorRef} type="fixed" position={[0, -1.8, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[5, 0.1, 5]} />
          <meshStandardMaterial color="snow" visible={false} />
        </mesh>
      </RigidBody>

      <RigidBody
        ref={santaRef}
        type="dynamic"
        colliders={false}
        position={[0, 5, 0]}
        name="santa"
      >
        <CuboidCollider args={[1, 2.8, 1]} position={[0, 0, 0]} mass={0.3}/>
        <Santa position={[0, 0, 0]} rotation={[0, degToRad(180),0]} scale={9} />
      </RigidBody>
    </group>
  )
} 