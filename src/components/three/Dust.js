import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ROOM } from '../../scene/layout'

const DUST_COUNT = 220
const DRIFT_SPEED = 0.012

// Slow dust motes floating in the lamplight — sells the evening stillness.
export function Dust() {
  const ref = useRef()
  const positions = React.useMemo(() => {
    const array = new Float32Array(DUST_COUNT * 3)
    for (let i = 0; i < DUST_COUNT; i++) {
      array[i * 3] = ROOM.wallLeftX + Math.random() * ROOM.width * 0.75
      array[i * 3 + 1] = 0.2 + Math.random() * (ROOM.height - 0.4)
      array[i * 3 + 2] = ROOM.wallBackZ + Math.random() * 6
    }
    return array
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.rotation.y = t * DRIFT_SPEED
      ref.current.position.y = Math.sin(t * 0.18) * 0.05
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d8f5e6"
        size={0.014}
        sizeAttenuation
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
