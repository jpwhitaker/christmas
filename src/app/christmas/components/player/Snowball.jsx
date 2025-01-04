import { useRef } from "react";
import { RigidBody, BallCollider } from "@react-three/rapier";
import { Sphere } from "@react-three/drei";
import { usePlayOof, usePlaySnowballHit } from '../useAppSounds';

export function Snowball({ position = [0, 0, 0], scale = 1, linearVelocity = [0, 0, 0] }) {
  const [playOof] = usePlayOof();
  const [playSnowballHit] = usePlaySnowballHit();
  const hasCollided = useRef(false);

  const handleCollision = ({ other }) => {
    if (other.rigidBodyObject?.name === 'santa') {
      if (!hasCollided.current) {
        playOof();
        hasCollided.current = true;
      }
    }
    else if (!other.colliderObject?.parent?.name?.includes('terrain')) {
      if (!hasCollided.current) {
        playSnowballHit();
        hasCollided.current = true;
      }
    }
  };

  return (
    <RigidBody 
      type="dynamic" 
      position={position} 
      colliders={false}
      linearVelocity={linearVelocity}
      mass={180}
      enabledTranslations={[true, true, true]}
      ccd={true}
      onCollisionEnter={handleCollision}
    >
      <BallCollider args={[0.5 * scale]} />
      <Sphere args={[0.5, 32, 32]} scale={scale}>
        <meshStandardMaterial color="white" roughness={0.2} />
      </Sphere>
    </RigidBody>
  );
} 