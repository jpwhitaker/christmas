"use client";
import { Environment } from "@react-three/drei";
import { NoisyTerrain } from "./terrain/FloorHuge.jsx";
import { degToRad } from "three/src/math/MathUtils";
import { Pine } from "./scenery/Pine.jsx";
import { RigidBody } from "@react-three/rapier";
import { KeyboardControls} from '@react-three/drei'
import { ColliderHouse } from "./scenery/ColliderHouse.jsx";
import { FallingSanta } from "./player/FallingSanta.jsx";
import { SunDirectionalLight } from "./terrain/SunDirectionalLight.jsx";
import PineForest from "./scenery/PineForest.jsx";

export function GameScene2() {

  return (
    <>
      <SunDirectionalLight />
      <Environment preset="dawn" background={false} environmentIntensity={0.8} />
      <fog attach="fog" args={["#e0f2fe", 600, 2000]} />
      <KeyboardControls map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'], up: true },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'], up: true },
        { name: 'left', keys: ['ArrowLeft', 'KeyA'], up: true },
        { name: 'right', keys: ['ArrowRight', 'KeyD'], up: true },
      ]}>
        <FallingSanta />
      </KeyboardControls>
      <RigidBody type="fixed" position={[0, 0, 0]} name="noisyTerrain">
        <NoisyTerrain position={[0, 0, 0]} />
      </RigidBody>

      <ColliderHouse
        position={[0, 3, -50]}
        rotation={[0, degToRad(180), 0]}
        roofColor="yellow"
      />
      <ColliderHouse
        position={[-80, 3, -70]}
        rotation={[0, degToRad(-200), 0]}
        roofColor="red"
      />
      <ColliderHouse
        position={[-30, 3, 30]}
        rotation={[0, degToRad(-160), 0]}
        roofColor="green"
      />
      <ColliderHouse
        position={[90, 3, 0]}
        rotation={[0, degToRad(160), 0]}
        roofColor="blue"
      />

      <Pine scale={26} position={[3, 12, -50]} rotation={[0, degToRad(30), degToRad(-2)]} />
      <Pine scale={26} position={[-40, 12, -60]} rotation={[0, 0, degToRad(2)]} />
      <Pine scale={27} position={[30, 12, -80]} rotation={[0, 0, degToRad(2)]} />
      <Pine scale={28} position={[65, 12.5, -145]} rotation={[0, 0, degToRad(2)]} />
      <Pine scale={25} position={[60, 12.5, -150]} rotation={[0, 0, degToRad(2)]} />

      <PineForest
        seed={12345}
        innerRadius={200}
        outerRadius={1000}
        density={0.0002} // Adjust this to control number of trees
      />
    </>
  );
}




