import { Present } from "./Present"
import { RigidBody, CuboidCollider, BallCollider, coll } from "@react-three/rapier"
import { Plane } from "@react-three/drei"
import { degToRad } from "three/src/math/MathUtils"
export function PresentStack(props) {
  return (
    <group {...props}>
      <CollidablePresent position={[-0.44, 0, 0]}/>
      <CollidablePresent position={[-0.22, 0, 0]}/>
      <CollidablePresent position={[0, 0, 0]}/>
      <CollidablePresent position={[0.22, 0, 0]}/>
      <CollidablePresent position={[0.44, 0, 0]}/>
      
      <CollidablePresent position={[0.32, 0.2, 0]}/>
      <CollidablePresent position={[0.12, 0.2, 0]}/>
      <CollidablePresent position={[-0.12, 0.2, 0]}/>
      <CollidablePresent position={[-0.32, 0.2, 0]}/>

      <CollidablePresent position={[0.22, 0.4, 0]}/>
      <CollidablePresent position={[-0.01, 0.4, 0]}/>
      <CollidablePresent position={[-0.22, 0.4, 0]}/>

      <CollidablePresent position={[0.12, 0.6, 0]}/>
      <CollidablePresent position={[-0.12, 0.6, 0]}/>
      
      <CollidablePresent position={[0, 0.8, 0]}/>

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1, 0.5, 0.02]} position={[0, 0, 0]} rotation={[degToRad(90), 0, 0]}/>
        <Plane args={[10, 1]} position={[0, 0, 0]} rotation={[degToRad(90), 0, 0]}/>
      </RigidBody>
      
    </group>
  )
}

const CollidablePresent = (props) => {
  return (
    <group {...props}>
    <RigidBody type="dynamic" colliders={false} {...props}>
      <CuboidCollider args={[0.16, 0.16, 0.16]} position={[0, 0.16, 0]} mass={0.3}/>
      <Present scale={2.5} />
    </RigidBody>
    </group>
  )
}