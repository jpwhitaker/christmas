import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Present } from "./Present";


export const CollidablePresent = (props) => {
  return (
    <group {...props}>
    <RigidBody type="dynamic" colliders={false} {...props}>
      <CuboidCollider args={[0.16, 0.16, 0.16]} position={[0, 0.16, 0]} mass={0.3}/>
      <Present scale={2.5} />
    </RigidBody>
    </group>
  )
}