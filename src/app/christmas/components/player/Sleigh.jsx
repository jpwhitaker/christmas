import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshPhysicalMaterial } from 'three'

export function Sleigh(props) {
  const { nodes, materials } = useGLTF('/christmas/sleigh2.glb')
  
  // Create physical materials with the same colors
  const physicalMaterials = {
    lambert2SG: new MeshPhysicalMaterial({
      color: materials.lambert2SG.color,
      metalness: 0.2,
      roughness: 0.3,
    }),
    lambert3SG: new MeshPhysicalMaterial({
      color: materials.lambert3SG.color,
      metalness: 0.2,
      roughness: 0.3,
    }),
    lambert5SG: new MeshPhysicalMaterial({
      color: materials.lambert5SG.color,
      metalness: 0.2,
      roughness: 0.3,
    }),
  }

  return (
    <group {...props} dispose={null}>
      <group position={[-0.113, 0.053, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Sleigh_obj_1.geometry}
          material={physicalMaterials.lambert2SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Sleigh_obj_2.geometry}
          material={physicalMaterials.lambert3SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Sleigh_obj_3.geometry}
          material={physicalMaterials.lambert5SG}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/christmas/sleigh2.glb')
