/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial } from 'three'

export function House({ roofColor = '#ff0000', ...props }) {
  const { nodes, materials } = useGLTF('/christmas/house.glb')
  
  // Create new material for the roof
  const roofMaterial = new MeshStandardMaterial({ 
    color: roofColor,
    roughness: 0.7,
    metalness: 0.1
  })

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box002.geometry}
        material={materials._crayfishdiffuse}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box003.geometry}
        material={materials['03___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box004.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box005.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box006.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box007.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box008.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box009.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box010.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box011.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box012.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box013.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box014.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box015.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box016.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box017.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box018.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box019.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box020.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box021.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box022.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box023.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box024.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box025.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box026.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box027.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box028.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box029.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box030.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box031.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box032.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box033.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box034.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane006.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box035.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box036.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box037.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box038.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box039.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder001.geometry}
        material={materials._crayfishdiffuse}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box040.geometry}
        material={materials._crayfishdiffuse}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box041.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box042.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box043.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box044.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box045.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box046.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box047.geometry}
        material={materials['07___Default']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box001_1.geometry}
        material={materials._crayfishdiffuse}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box001_1_1.geometry}
        material={roofMaterial}
      />
    </group>
  )
}

useGLTF.preload('/christmas/house.glb')
