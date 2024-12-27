//add all the imports
import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { usePlaySplat, usePlaySkydive, usePlayPerfect } from './useAppSounds';
import { degToRad } from "three/src/math/MathUtils";
import * as THREE from "three";
import Santa from "./Santa";
import { useSleighStore } from './store';

const _tempCameraPos = new THREE.Vector3();
const _tempSantaPos = new THREE.Vector3();
const _tempLookAt = new THREE.Vector3();
const _tempDir = new THREE.Vector3();
const _tempEuler = new THREE.Euler();

const CAMERA_OFFSET_BEHIND = 40;  // How far behind Santa
const CAMERA_OFFSET_ABOVE = 30;   // How far above Santa
const CAMERA_OFFSET_LOOK_ABOVE = 2; // How far above Santa to look at
const MOVEMENT_SPEED = 30; // This will give us roughly the same feel as the original 0.5

export function FallingSanta() {
  const [playSplat] = usePlaySplat();
  const [playPerfect] = usePlayPerfect();
  const [playSkydive, { stop }] = usePlaySkydive();

  const hasPlayedSkydive = useRef(false);
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const currentImpulse = useRef({ x: 0, y: 0, z: 0 });
  const currentRoll = useRef({ x: 0, y: 0 });

  const [hasStarted] = useState(true);
  const [hasCollided, setHasCollided] = useState(false);

  const santaPhysicsRef = useRef();
  const santaBodyRef = useRef();

  const camera = useThree((state) => state.camera);
  const baseRotation = useRef(new THREE.Euler(degToRad(-90), 0, 0));

  // Initial camera setup
  useEffect(() => {
    const initialSantaPos = { x: 0, y: 540, z: 690 };
    camera.far = 10000;
    camera.fov = 35;
    camera.position.set(
      initialSantaPos.x,
      initialSantaPos.y + CAMERA_OFFSET_ABOVE,
      initialSantaPos.z + CAMERA_OFFSET_BEHIND
    );
    camera.lookAt(
      initialSantaPos.x,
      initialSantaPos.y,
      initialSantaPos.z
    );
    camera.updateProjectionMatrix();
  }, [camera]);

  // Play skydive sound right away
  useEffect(() => {
    playSkydive();
    console.log("skydive");
  }, [playSkydive]);



  useFrame((state, delta) => {
    // Pause if we're in /scene2 and haven't started
    const isScene2 = window.location.pathname.includes("/scene2");
    if (isScene2 && !hasStarted) return;

    const keys = getKeys();

    //
    // 1. Handle inputs -> Impulse + rotation
    //
    if (keys.forward || keys.backward || keys.left || keys.right) {
      console.log({
        delta,
        impulseX: currentImpulse.current.x,
        impulseZ: currentImpulse.current.z,
        // Also log what 0.5/delta would be as a reference
        suggestedMultiplier: 0.5 / delta,
      });
    }

    if (keys.forward) {
      currentImpulse.current.z -= delta * MOVEMENT_SPEED;
      currentRoll.current.x -= delta * 2;
    }
    if (keys.backward) {
      currentImpulse.current.z += delta * MOVEMENT_SPEED;
      currentRoll.current.x += delta * 2;
    }
    if (keys.left) {
      currentImpulse.current.x -= delta * MOVEMENT_SPEED;
      currentRoll.current.y -= delta * 2;
    }
    if (keys.right) {
      currentImpulse.current.x += delta * MOVEMENT_SPEED;
      currentRoll.current.y += delta * 2;
    }

    // If none of the forward/back keys are pressed, rotate back to idle
    if (!keys.forward && !keys.backward) {
      currentRoll.current.x = THREE.MathUtils.lerp(currentRoll.current.x, 0, delta * 5);
    }

    // If none of the left/right keys are pressed, rotate back to idle
    if (!keys.right && !keys.left) {
      currentRoll.current.y = THREE.MathUtils.lerp(currentRoll.current.y, 0, delta * 5);
    }

    // Clamp the roll values to ±30 degrees (±0.52 radians)
    currentRoll.current.x = THREE.MathUtils.clamp(currentRoll.current.x, degToRad(-45), degToRad(45));
    currentRoll.current.y = THREE.MathUtils.clamp(currentRoll.current.y, degToRad(-40), degToRad(40));

    // Lerp impulse back to zero
    currentImpulse.current.x = THREE.MathUtils.lerp(currentImpulse.current.x, 0, delta * 2);
    currentImpulse.current.z = THREE.MathUtils.lerp(currentImpulse.current.z, 0, delta * 2);

    // Apply physics impulse if body exists
    if (!santaPhysicsRef.current) return;
    santaPhysicsRef.current.applyImpulse(
      {
        x: currentImpulse.current.x,
        y: 0,
        z: currentImpulse.current.z
      },
      true
    );

    //
    // 2. Rotation logic with a reusable Euler
    //
    if (santaBodyRef.current) {
      _tempEuler.copy(baseRotation.current);
      // Tilt forward/back or side to side
      _tempEuler.x += currentRoll.current.x;
      _tempEuler.y += currentRoll.current.y;
      // If you also want to tilt side to side on Z, use:
      // _tempEuler.z += someValue

      // Apply to Santa's model
      santaBodyRef.current.rotation.copy(_tempEuler);
    }

    //
    // 3. Camera follow logic
    //
    // Get Santa's position from physics
    const { x, y, z } = santaPhysicsRef.current.translation();
    _tempSantaPos.set(x, y, z);

    // Desired camera position (behind & above Santa)
    _tempCameraPos.copy(_tempSantaPos);
    _tempCameraPos.z += CAMERA_OFFSET_BEHIND;   // behind
    _tempCameraPos.y += CAMERA_OFFSET_ABOVE;    // above

    // Smoothly move camera
    state.camera.position.lerp(_tempCameraPos, delta * 5);

    // Make camera look slightly above Santa
    _tempLookAt.copy(_tempSantaPos);
    _tempLookAt.y += CAMERA_OFFSET_LOOK_ABOVE;
    state.camera.lookAt(_tempLookAt);

    // If you need the camera's direction for anything,
    // you could do something like:
    // state.camera.getWorldDirection(_tempDir)
    // and then use `_tempDir` as needed
  });

  const handleCollision = ({ other }) => {
    if (hasCollided) return;
    console.log("collision");
    stop();
    useSleighStore.getState().setHasCollided(true);

    if (other.colliderObject?.name === "noisyTerrain") {
      console.log("splat - first collision");
      playSplat();
      setHasCollided(true);
      useSleighStore.getState().setLastCollision('floor');
    }
    if (other.colliderObject?.name.includes("house")) {
      console.log(`collided with ${other.colliderObject?.name}`);
      const color = other.colliderObject.name.split('-')[0];
      console.log(`collided with ${color} house`);
      useSleighStore.getState().setHouseHit(color);
      playPerfect();
      setHasCollided(true);
      useSleighStore.getState().setLastCollision('house');
    }
  };

  return (
    <RigidBody
      ref={santaPhysicsRef}
      type="dynamic"
      position={[0, 540, 690]}
      colliders={false}
      onCollisionEnter={handleCollision}
    >
      <CuboidCollider args={[1, 0.45, 2.5]} position={[0, 0.5, -0.6]} />
      <Santa
        scale={10}
        position={[0, 0, 0]}
        rotation={[degToRad(-90), 0, 0]}
        ref={santaBodyRef}
      />
    </RigidBody>
  );
}