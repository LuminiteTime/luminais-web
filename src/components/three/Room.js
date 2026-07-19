import React from 'react'
import { ROOM, WINDOW } from '../../scene/layout'
import { palette } from '../../scene/palette'
import { makeCityTexture } from './textures'

const WALL_THICKNESS = 0.1

export function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color={palette.floor} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, ROOM.height / 2, ROOM.wallBackZ - WALL_THICKNESS / 2]}>
        <boxGeometry args={[ROOM.width, ROOM.height, WALL_THICKNESS]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>

      {/* Left wall */}
      <mesh position={[ROOM.wallLeftX - WALL_THICKNESS / 2, ROOM.height / 2, 1]}>
        <boxGeometry args={[WALL_THICKNESS, ROOM.height, ROOM.depth]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>

      {/* Green LED strip washing the wall behind the desk */}
      <mesh position={[0.3, 0.06, ROOM.wallBackZ + 0.02]}>
        <boxGeometry args={[3.4, 0.03, 0.02]} />
        <meshBasicMaterial color={palette.accent} toneMapped={false} />
      </mesh>
      <pointLight
        position={[0.3, 0.35, ROOM.wallBackZ + 0.35]}
        color={palette.accent}
        intensity={2.2}
        distance={3.4}
        decay={2}
      />

      <WindowView />
    </group>
  )
}

function WindowView() {
  const cityTexture = React.useMemo(makeCityTexture, [])
  return (
    <group position={[WINDOW.x, WINDOW.y, WINDOW.z]}>
      <mesh>
        <planeGeometry args={[WINDOW.width, WINDOW.height]} />
        <meshBasicMaterial map={cityTexture} toneMapped={false} />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[WINDOW.width + 0.08, 0.06, 0.04]} />
        <meshStandardMaterial color="#1e2a24" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.06, WINDOW.height + 0.08, 0.04]} />
        <meshStandardMaterial color="#1e2a24" roughness={0.6} />
      </mesh>
      {/* Cool moonlight spilling in */}
      <pointLight
        position={[0, 0.3, 0.9]}
        color="#9fc4e8"
        intensity={1.4}
        distance={4.5}
        decay={2}
      />
    </group>
  )
}
