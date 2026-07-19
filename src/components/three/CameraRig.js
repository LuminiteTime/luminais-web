import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { createCameraSampler } from '../../scene/cameraPath'
import { scrollStore } from '../../lib/scrollStore'

const DAMPING = 3.2 // higher = snappier; scroll scrub adds its own smoothing

export function CameraRig() {
  const sampler = useMemo(createCameraSampler, [])
  const targets = useRef({
    position: new THREE.Vector3(),
    lookAt: new THREE.Vector3(0.2, 1, -1.5),
    sampledPosition: new THREE.Vector3(),
    sampledLookAt: new THREE.Vector3(),
  })

  useFrame(({ camera }, delta) => {
    const { position, lookAt, sampledPosition, sampledLookAt } = targets.current
    const progress = scrollStore.progress

    sampler.samplePosition(progress, sampledPosition)
    sampler.sampleLookAt(progress, sampledLookAt)

    const blend = scrollStore.reducedMotion ? 1 : 1 - Math.exp(-delta * DAMPING)
    position.lerp(sampledPosition, blend)
    lookAt.lerp(sampledLookAt, blend)

    camera.position.copy(position)
    camera.lookAt(lookAt)

    const targetFov = sampler.sampleFov(progress)
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, blend)
      camera.updateProjectionMatrix()
    }
  })

  return null
}
