"use client";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils";
import { House } from "./House";

export const ColliderHouse = ({ position, rotation, roofColor }) => {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[9, 12, 5]} rotation={[0, degToRad(9), 0]} position={[23, 0, 3]} name={`${roofColor}-house`} />
        <House
          scale={.15}
          position={[0, 0, 0]}
          roofColor={roofColor} />
      </RigidBody>
    </group>
  );
};
