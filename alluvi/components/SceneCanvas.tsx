'use client'

import { useEffect, useRef } from 'react'

export default function SceneCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    let raf = 0
    let renderer: any, scene: any, camera: any
    let particles: any
    let floaters: any[] = []
    let scrollY = 0

    const init = async () => {
      const THREE = await import('three')
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // ── Renderer ──────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      mountRef.current!.appendChild(renderer.domElement)

      // ── Scene ─────────────────────────────────────────────
      scene = new THREE.Scene()

      // ── Camera ────────────────────────────────────────────
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300)
      camera.position.set(0, 0, 14)

      // ── DNA Helix particle system ──────────────────────────
      const COUNT = 4000
      const pos = new Float32Array(COUNT * 3)
      const col = new Float32Array(COUNT * 3)
      const sizes = new Float32Array(COUNT)

      for (let i = 0; i < COUNT; i++) {
        const t = (i / COUNT) * Math.PI * 28
        const strand = i % 3
        const phaseOffset = (strand / 3) * Math.PI * 2
        const radius = strand === 2 ? 0 : 2.2
        const spread = strand === 2 ? 0 : 0.18

        pos[i * 3]     = Math.cos(t + phaseOffset) * radius + (Math.random() - 0.5) * spread
        pos[i * 3 + 1] = (i / COUNT) * 55 - 27
        pos[i * 3 + 2] = Math.sin(t + phaseOffset) * radius + (Math.random() - 0.5) * spread

        // Violet → Rose gradient + scattered white sparks
        const pct = i / COUNT
        const isCore = strand === 2
        col[i * 3]     = isCore ? 1 : 0.486 + 0.471 * pct
        col[i * 3 + 1] = isCore ? 1 : 0.227 + 0.020 * pct
        col[i * 3 + 2] = isCore ? 1 : 0.929 - 0.560 * pct
        sizes[i] = isCore ? 0.03 + Math.random() * 0.04 : 0.05 + Math.random() * 0.04
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))

      const mat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
      })

      particles = new THREE.Points(geo, mat)
      scene.add(particles)

      // ── Floating wireframe geometries ──────────────────────
      const addFloater = (geometry: any, color: number, x: number, y: number, z: number) => {
        const m = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.12 })
        const mesh = new THREE.Mesh(geometry, m)
        mesh.position.set(x, y, z)
        scene.add(mesh)
        floaters.push(mesh)
        return mesh
      }

      const ico1 = addFloater(new THREE.IcosahedronGeometry(1.8, 1),  0x7C3AED, -7,  4, -4)
      const ico2 = addFloater(new THREE.TorusGeometry(1.4, 0.35, 8, 16), 0xF43F5E, 7, -3, -5)
      const ico3 = addFloater(new THREE.OctahedronGeometry(1.2),       0xA78BFA, 5,  5, -3)
      const ico4 = addFloater(new THREE.TorusKnotGeometry(0.8, 0.25, 64, 8), 0xFB7185, -5, -5, -2)

      // ── Lighting ──────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0x7C3AED, 0.4))
      const pLight = new THREE.PointLight(0x8B5CF6, 3, 25)
      pLight.position.set(0, 5, 5)
      scene.add(pLight)
      const pLight2 = new THREE.PointLight(0xF43F5E, 2, 20)
      pLight2.position.set(0, -5, 3)
      scene.add(pLight2)

      // ── GSAP camera scroll path ───────────────────────────
      const proxy = { z: 14, y: 0, rotX: 0, helixRotY: 0, lightX: 0 }

      gsap.to(proxy, {
        z: 2.5,
        y: -12,
        rotX: 0.35,
        helixRotY: Math.PI * 3,
        lightX: 10,
        ease: 'none',
        scrollTrigger: {
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
          onUpdate: (self) => {
            camera.position.z = proxy.z
            camera.position.y = proxy.y
            camera.rotation.x = proxy.rotX
            particles.rotation.y = proxy.helixRotY
            pLight.position.x = Math.sin(self.progress * Math.PI * 2) * proxy.lightX
            pLight2.position.x = Math.cos(self.progress * Math.PI * 2) * 8

            // Tilt camera slightly toward scroll direction
            camera.rotation.z = Math.sin(self.progress * Math.PI) * 0.04
          },
        },
      })

      // ── Animation loop ────────────────────────────────────
      const clock = new THREE.Clock()
      const animate = () => {
        raf = requestAnimationFrame(animate)
        const t = clock.getElapsedTime()

        // Idle micro-motion
        if (particles) {
          particles.rotation.x = Math.sin(t * 0.04) * 0.015
          particles.rotation.z = Math.cos(t * 0.03) * 0.01
        }

        // Floaters spin
        ico1.rotation.x += 0.003; ico1.rotation.y += 0.004
        ico2.rotation.y += 0.005; ico2.rotation.z += 0.002
        ico3.rotation.x += 0.002; ico3.rotation.z += 0.004
        ico4.rotation.y += 0.006; ico4.rotation.x += 0.003

        // Floater gentle float
        ico1.position.y = 4  + Math.sin(t * 0.5) * 0.4
        ico2.position.y = -3 + Math.cos(t * 0.6) * 0.3
        ico3.position.y = 5  + Math.sin(t * 0.4 + 1) * 0.5
        ico4.position.y = -5 + Math.cos(t * 0.55 + 2) * 0.35

        renderer.render(scene, camera)
      }
      animate()

      // ── Resize ────────────────────────────────────────────
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', onResize)
    }

    init()

    return () => {
      cancelAnimationFrame(raf)
      if (renderer) {
        renderer.dispose()
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement)
        }
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, background: 'linear-gradient(160deg,#06000F 0%,#0D0020 50%,#0A000A 100%)' }}
    />
  )
}
