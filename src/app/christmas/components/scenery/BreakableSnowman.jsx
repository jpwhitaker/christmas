import { Body } from './Body'
import { Hat } from './Hat'
import { Head } from './Head'
import { LowerBody } from './LowerBody'
import { Base } from './Base'
import { RigidBody, CuboidCollider, BallCollider, coll } from "@react-three/rapier"

export function BreakableSnowman(props) {
  return (
    <group {...props}>
      <RigidBody type="dynamic" colliders={false} position={[0, 0.166, 0.1]}>
        <CuboidCollider args={[0.15, 0.12, 0.15]} position={[0, 0.51, 0]} mass={0.2}/>
        <Hat />
      </RigidBody>

      <RigidBody type="dynamic" colliders={false} position={[0, 0.13, 0.1]}>
        <CuboidCollider args={[0.08, 0.01, 0.08]} position={[0, 0.4, 0.0]} name="headTop"/>
        <BallCollider args={[0.14, 0.12]} position={[0, 0.25, 0]} name="headBall"/>
        <CuboidCollider args={[0.08, 0.01, 0.08]} position={[0, 0.13, 0.0]} name="headBase"/>
        <Head />
      </RigidBody>

      <RigidBody type="dynamic" colliders={false} position={[0, 0.1, 0]}>
        
        <BallCollider args={[0.23, 0.12, 0.23]} position={[0.01, -0.1, 0.11]} name="bodyBall"/>
        <CuboidCollider args={[0.1, 0.01, 0.1]} position={[0, 0.14, 0.11]} name="neck"/>
        
        <CuboidCollider args={[0.1, 0.01, 0.1]} position={[0, -0.34, 0.11]} name="bodyBase"/>
        <LowerBody opacity={0.5} transparent={true}/>
      </RigidBody>
      
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.3, 0.2, 0.3]} position={[0, -0.45, 0]}/>
        <Base />
      </RigidBody>
    </group>
  )
}
