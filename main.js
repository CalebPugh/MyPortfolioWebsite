import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('/space.jpg');
scene.background = spaceTexture;

// Avatar

const calebTexture = new THREE.TextureLoader().load('/Caleb_Headshot.png');

const caleb = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: calebTexture }));

scene.add(caleb);

// Satelite

const satelliteTexture = new THREE.TextureLoader().load('/metal.jpg');

// Satellite components
const satelliteBody = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 5, 32),
  new THREE.MeshStandardMaterial({ map: satelliteTexture })
);

const satellitePanel = new THREE.Mesh(
  new THREE.BoxGeometry(1, 4, 0.1),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);

// Clone and position the solar panels
satellitePanel.position.x = 2;
const satellitePanel2 = satellitePanel.clone();
satellitePanel2.position.x = -2;

// Group the satellite body and panels together
const satellite = new THREE.Group();
satellite.add(satelliteBody, satellitePanel, satellitePanel2);
scene.add(satellite);

// Position the satellite before the moon
satellite.position.z = 20;  // Position closer to the camera than the moon
satellite.position.x = 5;

// Asteroids
const asteroidTexture = new THREE.TextureLoader().load('/Asteroids.jpg');
const asteroidGroup = []; // Array to store asteroids

function addAsteroid() {
  const geometry = new THREE.DodecahedronGeometry(0.5, 0); // Create asteroid shape
  const material = new THREE.MeshStandardMaterial({ map: asteroidTexture });
  const asteroid = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(20)); // Random position for each asteroid

  asteroid.position.set(x, y, z + 40); // Position after the moon
  scene.add(asteroid);
  asteroidGroup.push(asteroid); // Add asteroid to the array
}

Array(50).fill().forEach(addAsteroid);

// Moon

const moonTexture = new THREE.TextureLoader().load('/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

caleb.position.z = -5;
caleb.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  caleb.rotation.y += 0.01;
  caleb.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  satellite.rotation.y += 0.01;

  asteroidGroup.forEach((asteroid) => {
    asteroid.rotation.x += 0.01;
    asteroid.rotation.y += 0.01;
  });

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();