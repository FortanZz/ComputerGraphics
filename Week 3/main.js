import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(14, 17, 25)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6)
const ambientLight = new THREE.AmbientLight(0xffffff, 2.3)
scene.add(pointLight, ambientLight)

const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({ color: 0xb44d1a, wireframe: true })
const sun = new THREE.Mesh(geometry, material)
scene.add(sun)

const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit)

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0X1E40FF, roughness: 0.9 })
)
earth.position.x = 6
earthOrbit.add(earth)

const control = new OrbitControls(camera, renderer.domElement);

const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit)

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xece1e1, roughness: 0.9 })
)

moon.position.x = 1.6
moonOrbit.add(moon)

const saturnOrbit = new THREE.Object3D()
sun.add(saturnOrbit)

const saturnSystem = new THREE.Group()
saturnSystem.position.x = 10
saturnOrbit.add(saturnSystem)

const saturn = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xd9b477, roughness: 0.9 })
)
saturn.rotation.z = 0.4
saturnSystem.add(saturn)

const saturnRings = new THREE.Group()
saturnRings.rotation.x = Math.PI / 2
saturn.add(saturnRings)

const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xc9ae82,
    side: THREE.DoubleSide,
    roughness: 0.8,
})
saturnRings.add(
    new THREE.Mesh(new THREE.RingGeometry(1.6, 2.4, 64), ringMaterial)
)

const uranusOrbit = new THREE.Object3D()
sun.add(uranusOrbit)

const uranusSystem = new THREE.Group()
uranusSystem.position.x = 14
uranusOrbit.add(uranusSystem)

const uranus = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x7ad8e8, roughness: 0.9 })
)
uranusSystem.add(uranus)

const uranusMoonOrbit = new THREE.Object3D()
uranusSystem.add(uranusMoonOrbit)

const uranusMoon = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xd8d1c8, roughness: 0.9 })
)
uranusMoon.position.x = 1.4
uranusMoonOrbit.add(uranusMoon)

function animate() {
    requestAnimationFrame(animate)
    control.update()
    earthOrbit.rotation.y += 0.01
    saturnOrbit.rotation.y += 0.004
    uranusOrbit.rotation.y += 0.002
    uranusMoonOrbit.rotation.y += 0.035

    moonOrbit.rotation.y += 0.04
    earth.rotation.y += 0.05
    saturn.rotation.y += 0.03
    uranus.rotation.y += 0.01
    sun.rotation.y += 0.006
    renderer.render(scene, camera)
}
animate()