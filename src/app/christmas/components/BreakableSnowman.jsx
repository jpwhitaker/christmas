import { Body } from './Body'
import { Hat } from './Hat'
import { Head } from './Head'
import { RigidBody, CuboidCollider, BallCollider } from "@react-three/rapier"

export function BreakableSnowman(props) {
  return (
    <group {...props}>
      <RigidBody type="dynamic" colliders={false}>
        <CuboidCollider args={[0.15, 0.12, 0.15]} position={[0, 0.51, 0]}/>
        <Hat />
      </RigidBody>

      <RigidBody type="dynamic" colliders={false}>
        <BallCollider args={[0.15, 0.12, 0.15]} position={[0, 0.25, 0]}/>
        <Head />
      </RigidBody>
      
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.3, 0.35, 0.3]} position={[0, -0.2, 0]}/>
        <Body />
      </RigidBody>
    </group>
  )
}
