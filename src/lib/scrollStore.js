// Mutable scroll-progress singleton. Written once per scroll frame by the
// ScrollTrigger in Overlay, read every frame by the CameraRig — deliberately
// outside React state to avoid re-rendering the tree on scroll.
export const scrollStore = {
  progress: 0,
  reducedMotion: false,
}
