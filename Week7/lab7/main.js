import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

const scene = new THREE.Scene();
scene.background = new THREE.Color('#191970');

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 8, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.style.margin = '0';
renderer.domElement.style.display = 'block';
document.body.appendChild(renderer.domElement);

const control = new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dir = new THREE.DirectionalLight(0xffffff, 2.5);
dir.position.set(4, 6, 5);
scene.add(dir);

scene.add(new THREE.GridHelper(20, 20, 0x778899, 0x334455));

const pickables = [];
const shapes = [
  { geometry: new THREE.BoxGeometry(1, 1, 1), color: 0xff5733, scale: 1 },
  { geometry: new THREE.SphereGeometry(0.5, 32, 16), color: 0x2ecc71, scale: 1.2 },
  { geometry: new THREE.ConeGeometry(0.55, 1.2, 32), color: 0x3498d8, scale: 1 },
  { geometry: new THREE.CylinderGeometry(0.45, 0.6, 1.1, 32), color: 0xf1c40f, scale: 1.1 },
  { geometry: new THREE.TorusGeometry(0.4, 0.16, 16, 48), color: 0x985986, scale: 1.2 },
  { geometry: new THREE.OctahedronGeometry(0.6), color: 0xff8c42, scale: 1 },
];

for (let i = 0; i < shapes.length; i++) {
  const { geometry, color, scale } = shapes[i];
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color }),
  );
  mesh.scale.setScalar(scale);
  mesh.position.set(
    (i - (shapes.length - 1) / 2) * 2.5,
    geometry.parameters.height ? geometry.parameters.height * scale / 2 : 0.5 * scale,
    0,
  );
  scene.add(mesh);
  pickables.push(mesh);
}

const pointer = new THREE.Vector2();

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const W = rect.width;
  const H = rect.height;

  pointer.x = (2 * x) / W - 1;
  pointer.y = 1 - (2 * y) / H;

}

const rayCaster = new THREE.Raycaster();
let selected = null;
let dragging = false;

renderer.domElement.addEventListener('pointerdown', (event) => {
updatePointer(event);
rayCaster.setFromCamera(pointer, camera);
const hits = rayCaster.intersectObjects(pickables);
if (selected){
  selected.material.emissive.set(0x000000);
}
selected = hits.length > 0 ? hits[0].object : null;

if (selected){
  selected.material.emissive.set(0x882200);
  dragging = true;
  control.enabled = false;
  scaleControl.setValue(selected.scale.x);
}
});

const plane = new THREE.Plane(new THREE.Vector3(0,1,0),0);
const intersect = new THREE.Vector3();

renderer.domElement.addEventListener('pointermove', (event) => {
  if(!dragging){
    return;
  }
  updatePointer(event);
  rayCaster.setFromCamera(pointer, camera);
  if(rayCaster.ray.intersectPlane(plane, intersect)){
    selected.position.x = intersect.x;
    selected.position.z = intersect.z;
  }
 
  
});

renderer.domElement.addEventListener('pointerup', (event) => {
  dragging = false;
  control.enabled = true;
});

const initialTransforms = pickables.map(obj => ({
  position: obj.position.clone(),
  scale: obj.scale.clone(),
}));

const gui = new GUI();
const settings = {
  backgroundColor: '#191970',
  scale: 1,
  reset() {
    for (let i = 0; i < pickables.length; i++) {
      pickables[i].position.copy(initialTransforms[i].position);
      pickables[i].scale.copy(initialTransforms[i].scale);
    }
    if (selected) {
      scaleControl.setValue(selected.scale.x);
    }
  },
};

gui.add(settings, 'reset').name('Reset Objects');
gui.addColor(settings, 'backgroundColor')
  .name('Background Color')
  .onChange((color) => scene.background.set(color));
const scaleControl = gui.add(settings, 'scale', 0.4, 2.5, 0.1)
  .name('Selected Scale')
  .onChange((scale) => {
    if (selected) {
      const initial = initialTransforms[pickables.indexOf(selected)];
      selected.scale.setScalar(scale);
      selected.position.y = initial.position.y * scale / initial.scale.y;
    }
  });

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    control.update();
    renderer.render(scene, camera);
}

animate();