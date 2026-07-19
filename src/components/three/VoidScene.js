import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import { palette } from '../../scene/palette'
import { makeScreenTexture } from './textures'

const PARTICLE_COUNT = 1400
const VOID_SPAN = { x: 7, yMin: -1.5, yMax: 4.5, zNear: -2.5, zFar: -30 }
const CODE_PANEL_COUNT = 12

// The digital space on the other side of the laptop screen: a green grid
// plain, drifting particles and floating code panels around a glowing core.
export function VoidScene() {
  return (
    <group>
      <Grid
        position={[0.35, -0.6, -16]}
        args={[40, 40]}
        cellSize={0.55}
        cellThickness={0.6}
        cellColor={palette.accentDeep}
        sectionSize={2.75}
        sectionThickness={1.1}
        sectionColor={palette.accent}
        fadeDistance={26}
        fadeStrength={2.2}
        infiniteGrid
      />
      <VoidParticles />
      <CodePanels />
      <Core />
    </group>
  )
}

function VoidParticles() {
  const ref = useRef()
  const positions = React.useMemo(() => {
    const array = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      array[i * 3] = (Math.random() - 0.5) * 2 * VOID_SPAN.x + 0.35
      array[i * 3 + 1] = VOID_SPAN.yMin + Math.random() * (VOID_SPAN.yMax - VOID_SPAN.yMin)
      array[i * 3 + 2] = VOID_SPAN.zNear + Math.random() * (VOID_SPAN.zFar - VOID_SPAN.zNear)
    }
    return array
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.06
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={palette.accent}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function CodePanels() {
  const texture = React.useMemo(makeScreenTexture, [])
  const group = useRef()

  const panels = React.useMemo(
    () =>
      Array.from({ length: CODE_PANEL_COUNT }, (_, i) => ({
        position: [
          0.35 + (Math.random() - 0.5) * 8,
          0.4 + Math.random() * 2.6,
          -3.5 - i * 1.9 - Math.random(),
        ],
        rotation: [(Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.9, 0],
        scale: 0.5 + Math.random() * 0.5,
      })),
    []
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    group.current?.children.forEach((panel, i) => {
      panel.position.y += Math.sin(t * 0.6 + i * 1.7) * 0.0009
    })
  })

  return (
    <group ref={group}>
      {panels.map((panel, i) => (
        <mesh key={i} position={panel.position} rotation={panel.rotation} scale={panel.scale}>
          <planeGeometry args={[0.9, 0.56]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

function Core() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.25
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2
    }
  })
  return (
    <group position={[0.5, 1.3, -14]}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial color={palette.accent} wireframe transparent opacity={0.8} />
      </mesh>
      <pointLight color={palette.accent} intensity={6} distance={12} decay={2} />
    </group>
  )
}
