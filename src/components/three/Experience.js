import React, { useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { CameraRig } from './CameraRig'
import { Room } from './Room'
import { DeskArea } from './DeskArea'
import { WallBoard, WallLight } from './WallBoard'
import { VoidScene } from './VoidScene'
import { Dust } from './Dust'
import { SCREEN_CROSS_T } from '../../scene/cameraPath'
import { palette } from '../../scene/palette'
import { scrollStore } from '../../lib/scrollStore'

const VOID_BG = new THREE.Color('#020a06')
const ROOM_BG = new THREE.Color(palette.bg)
// Crossfade window (scroll progress) where fog/background swap to the void.
const FADE_START = 0.8
const ROOM_HIDE_T = SCREEN_CROSS_T + 0.03
const VOID_SHOW_T = 0.42

const FOG = {
  room: { near: 9, far: 20 },
  void: { near: 1.5, far: 19 },
}

export function Experience({ notes, onReady }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 50, near: 0.05, far: 60, position: [3.4, 2.2, 4.6] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      shadows
      onCreated={onReady}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, FOG.room.near, FOG.room.far]} />
      <CameraRig />
      <SceneGraph notes={notes} />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.5} intensity={0.55} radius={0.72} />
        <Vignette offset={0.22} darkness={0.32} />
      </EffectComposer>
    </Canvas>
  )
}

function SceneGraph({ notes }) {
  const roomGroup = useRef()
  const voidGroup = useRef()
  const scratchColor = useRef(new THREE.Color())

  useFrame(({ scene }) => {
    const progress = scrollStore.progress
    const fade = THREE.MathUtils.clamp(
      (progress - FADE_START) / (SCREEN_CROSS_T - FADE_START),
      0,
      1
    )

    if (scene.fog) {
      scene.fog.color.copy(scratchColor.current.copy(ROOM_BG).lerp(VOID_BG, fade))
      scene.fog.near = THREE.MathUtils.lerp(FOG.room.near, FOG.void.near, fade)
      scene.fog.far = THREE.MathUtils.lerp(FOG.room.far, FOG.void.far, fade)
    }
    if (scene.background?.isColor) {
      scene.background.copy(scratchColor.current)
    }
    if (roomGroup.current) roomGroup.current.visible = progress < ROOM_HIDE_T
    if (voidGroup.current) voidGroup.current.visible = progress > VOID_SHOW_T
  })

  return (
    <>
      <ambientLight intensity={0.2} color="#bfeee0" />
      <group ref={roomGroup}>
        <Room />
        <DeskArea />
        <WallBoard notes={notes} />
        <WallLight />
        <Dust />
      </group>
      <group ref={voidGroup} visible={false}>
        <VoidScene />
      </group>
    </>
  )
}
