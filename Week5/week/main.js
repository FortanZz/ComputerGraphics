
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(3, 2, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = '0';
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(5, 8, 4);
scene.add(ambientLight, directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);

const positions = new Float32Array([
  0, 1.5, 0,  //v0
  0, -1.5, 0, // v1
  1, 0, 0,   // v2
  0, 0, 1,  // v3
  -1, 0, 0, // v4
  0,  0, -1, // v5
]);

const index = [
  0, 3, 2,
  0, 4, 3,
  0, 5, 4,
  0, 2, 5,// 4 upper faces
  1, 2, 3,
  1, 3, 4,
  1, 4, 5,
  1, 5, 2, // 4 lower faces
];

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setIndex(index);
geometry.computeVertexNormals();

const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshStandardMaterial({
    color: 0x66aaff,
    roughness: 0.4,
    side: THREE.FrontSide
  })
);

scene.add(mesh);

const nonIndexed = geometry.toNonIndexed();
nonIndexed.computeVertexNormals();

console.log('Vertices', geometry.attributes.position.count, 'Faces:', index.length / 3);
console.log('Vertices', nonIndexed.attributes.position.count, 'Faces:', index.length / 3);

window.addEventListener('keydown', (e) => {
  if (e.key === 'f') {
    mesh.geometry = mesh.geometry === geometry ? nonIndexed : geometry;
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.y += 0.007;
  controls.update();
  renderer.render(scene, camera);
}

animate();
