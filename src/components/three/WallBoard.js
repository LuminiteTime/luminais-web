import React from 'react'
import { NOTES, SHELF, ROOM } from '../../scene/layout'
import { palette } from '../../scene/palette'
import { makeNoteTexture } from './textures'

const NOTE_COLORS = [palette.paper, palette.paperGreen, palette.paperAmber, palette.paper, palette.paperGreen]
const NOTE_TILTS = [-0.06, 0.05, -0.04, 0.07, -0.05]

const BLANK_NOTES = [
  { x: -1.72, y: 1.55, tilt: 0.09 },
  { x: -0.98, y: 2.32, tilt: -0.08 },
  { x: 0.5, y: 2.3, tilt: 0.04 },
  { x: 1.22, y: 1.56, tilt: -0.06 },
  { x: 1.9, y: 2.28, tilt: 0.1 },
]

export function WallBoard({ notes }) {
  return (
    <group>
      {notes.map((note, i) => (
        <StickyNote key={note.title} note={note} index={i} />
      ))}
      {BLANK_NOTES.map((blank) => (
        <BlankNote key={`${blank.x}:${blank.y}`} {...blank} />
      ))}
      <Shelf />
    </group>
  )
}

function StickyNote({ note, index }) {
  const texture = React.useMemo(
    () =>
      makeNoteTexture({
        title: note.label,
        detail: note.hint,
        color: NOTE_COLORS[index % NOTE_COLORS.length],
      }),
    [note, index]
  )
  React.useEffect(() => () => texture.dispose(), [texture])

  return (
    <mesh
      position={[NOTES.xs[index], NOTES.ys[index], NOTES.z]}
      rotation={[0, 0, NOTE_TILTS[index % NOTE_TILTS.length]]}
    >
      <planeGeometry args={[NOTES.size, NOTES.size]} />
      <meshStandardMaterial map={texture} roughness={0.9} />
    </mesh>
  )
}

function BlankNote({ x, y, tilt }) {
  return (
    <mesh position={[x, y, NOTES.z]} rotation={[0, 0, tilt]}>
      <planeGeometry args={[NOTES.size * 0.55, NOTES.size * 0.55]} />
      <meshStandardMaterial color={palette.paperGreen} roughness={0.9} />
    </mesh>
  )
}

function Shelf() {
  const books = React.useMemo(() => {
    const colors = ['#234d3a', '#3d6b4f', '#7a5c33', '#2b3f55', '#4a3b52', '#31584a']
    let cursor = 0
    return Array.from({ length: SHELF.books }, (_, i) => {
      const width = 0.035 + (i % 3) * 0.012
      const height = 0.24 + ((i * 7) % 5) * 0.02
      const book = { x: cursor + width / 2, width, height, color: colors[i % colors.length] }
      cursor += width + 0.008
      return book
    })
  }, [])

  return (
    <group position={[SHELF.x, SHELF.y, SHELF.z]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[1.1, 0.035, 0.22]} />
        <meshStandardMaterial color={palette.desk} roughness={0.6} />
      </mesh>
      {books.map((book) => (
        <mesh key={book.x} position={[-0.45 + book.x, book.height / 2 + 0.018, 0]}>
          <boxGeometry args={[book.width, book.height, 0.16]} />
          <meshStandardMaterial color={book.color} roughness={0.7} />
        </mesh>
      ))}
      {/* A warm photo frame at the shelf end */}
      <mesh position={[0.38, 0.09, 0]} rotation={[0, 0, -0.06]}>
        <boxGeometry args={[0.14, 0.18, 0.015]} />
        <meshStandardMaterial color={palette.paperAmber} roughness={0.8} />
      </mesh>
    </group>
  )
}

// A soft green glow above the wall so the notes read clearly in the dark room.
export function WallLight() {
  return (
    <pointLight
      position={[0.2, 2.4, ROOM.wallBackZ + 1.4]}
      color="#bfeeda"
      intensity={1.5}
      distance={4.2}
      decay={2}
    />
  )
}
