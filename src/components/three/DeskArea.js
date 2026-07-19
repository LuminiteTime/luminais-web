import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { DESK, LAPTOP } from '../../scene/layout'
import { palette } from '../../scene/palette'
import { makeScreenTexture } from './textures'

const LAPTOP_STAND_HEIGHT = 0.14
const SCREEN_TILT = -0.28 // radians, top edge leaning toward the room

export function DeskArea() {
  return (
    <group>
      <Desk />
      <Laptop />
      <Lamp />
      <Mug position={[-0.35, DESK.topY, -1.05]} />
      <Notebook position={[1.15, DESK.topY, -1.0]} />
      <Plant position={[-1.0, DESK.topY, -1.6]} />
    </group>
  )
}

function Desk() {
  const legX = DESK.width / 2 - 0.08
  const legZ = DESK.depth / 2 - 0.08
  const legs = [
    [-legX, -legZ],
    [legX, -legZ],
    [-legX, legZ],
    [legX, legZ],
  ]
  return (
    <group position={[DESK.centerX, 0, DESK.centerZ]}>
      <mesh position={[0, DESK.topY - DESK.thickness / 2, 0]} castShadow>
        <boxGeometry args={[DESK.width, DESK.thickness, DESK.depth]} />
        <meshStandardMaterial color={palette.desk} roughness={0.55} metalness={0.1} />
      </mesh>
      {legs.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, (DESK.topY - DESK.thickness) / 2, z]}>
          <cylinderGeometry args={[0.025, 0.025, DESK.topY - DESK.thickness, 12]} />
          <meshStandardMaterial color="#141816" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Laptop() {
  const screenTexture = React.useMemo(makeScreenTexture, [])
  const screenMaterial = useRef()
  const glowLight = useRef()

  // Gentle screen flicker — slow pulse like a real display under load.
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (screenMaterial.current) {
      screenMaterial.current.emissiveIntensity = 1.05 + Math.sin(t * 2.1) * 0.08
    }
    if (glowLight.current) {
      glowLight.current.intensity = 1.6 + Math.sin(t * 2.1) * 0.25
    }
  })

  const standTop = DESK.topY + LAPTOP_STAND_HEIGHT
  return (
    <group position={[LAPTOP.x, 0, LAPTOP.z]}>
      {/* Stand */}
      <mesh position={[0, DESK.topY + LAPTOP_STAND_HEIGHT / 2, 0]}>
        <boxGeometry args={[0.3, LAPTOP_STAND_HEIGHT, 0.2]} />
        <meshStandardMaterial color="#1a211d" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Base */}
      <mesh position={[0, standTop + 0.012, 0]}>
        <boxGeometry args={[0.36, 0.024, 0.25]} />
        <meshStandardMaterial color="#232a26" roughness={0.35} metalness={0.7} />
      </mesh>
      {/* Screen */}
      <group position={[0, standTop + 0.02, -0.125]} rotation={[SCREEN_TILT, 0, 0]}>
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[0.36, 0.26, 0.012]} />
          <meshStandardMaterial color="#111614" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.13, 0.008]}>
          <planeGeometry args={[0.33, 0.225]} />
          <meshStandardMaterial
            ref={screenMaterial}
            color="#000000"
            emissive="#ffffff"
            emissiveMap={screenTexture}
            emissiveIntensity={1.05}
            roughness={0.9}
          />
        </mesh>
      </group>
      {/* Green light the screen throws onto the desk */}
      <pointLight
        ref={glowLight}
        position={[0, standTop + 0.18, 0.35]}
        color={palette.accent}
        intensity={1.6}
        distance={2.2}
        decay={2}
      />
      {/* External keyboard + mouse */}
      <mesh position={[0, DESK.topY + 0.012, 0.33]}>
        <boxGeometry args={[0.36, 0.018, 0.13]} />
        <meshStandardMaterial color="#1c2320" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.32, DESK.topY + 0.015, 0.33]}>
        <sphereGeometry args={[0.035, 16, 12]} />
        <meshStandardMaterial color="#1c2320" roughness={0.45} metalness={0.3} />
      </mesh>
    </group>
  )
}

function Lamp() {
  const x = DESK.centerX - 0.95
  const z = DESK.centerZ - 0.25
  return (
    <group position={[x, DESK.topY, z]}>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.03, 20]} />
        <meshStandardMaterial color="#181f1b" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0.02, 0.24, 0]} rotation={[0, 0, -0.12]}>
        <cylinderGeometry args={[0.012, 0.012, 0.46, 10]} />
        <meshStandardMaterial color="#181f1b" roughness={0.4} metalness={0.6} />
      </mesh>
      <group position={[0.1, 0.47, 0.02]} rotation={[0.4, 0, -1.0]}>
        <mesh>
          <coneGeometry args={[0.09, 0.16, 20, 1, true]} />
          <meshStandardMaterial
            color="#202b25"
            roughness={0.35}
            metalness={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.035, 14, 10]} />
          <meshBasicMaterial color={palette.warm} toneMapped={false} />
        </mesh>
      </group>
      <pointLight
        position={[0.14, 0.4, 0.06]}
        color={palette.warm}
        intensity={3.2}
        distance={2.6}
        decay={2}
        castShadow
        shadow-mapSize={[512, 512]}
      />
    </group>
  )
}

function Mug({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.1, 20]} />
        <meshStandardMaterial color={palette.warm} roughness={0.6} />
      </mesh>
      <mesh position={[0.055, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.028, 0.008, 10, 20]} />
        <meshStandardMaterial color={palette.warm} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Notebook({ position }) {
  return (
    <group position={position} rotation={[0, -0.35, 0]}>
      <mesh position={[0, 0.008, 0]}>
        <boxGeometry args={[0.22, 0.016, 0.3]} />
        <meshStandardMaterial color={palette.paper} roughness={0.85} />
      </mesh>
      <mesh position={[0.02, 0.02, 0.02]} rotation={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.16, 8]} />
        <meshStandardMaterial color="#26312b" roughness={0.5} />
      </mesh>
    </group>
  )
}

function Plant({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.05, 0.065, 0.1, 14]} />
        <meshStandardMaterial color="#3a2f24" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.16, 0]} scale={[1, 1.35, 1]}>
        <icosahedronGeometry args={[0.07, 1]} />
        <meshStandardMaterial color={palette.accentDeep} roughness={0.8} flatShading />
      </mesh>
    </group>
  )
}
