/** 
 * This module is responsible for rending the trees on the page.
 */

// Invoke init.
init();

// Invoke render.
render();

// Globals.

// The api key.
const API_KEY = '';

// Various three.js global variables
var scene,
  camera,
  renderer,
  controls,
  group;

// Different materials.
var leaveDarkMaterial = new THREE.MeshLambertMaterial({ color: 0x91E56E });
var leaveLightMaterial = new THREE.MeshLambertMaterial({ color: 0xA2FF7A });
var stemMaterial = new THREE.MeshLambertMaterial({ color: 0x7D5A4F });

// Variable for the cube.
var cube;

function init () {

  // TODO: Fetch trees.


  // Set up the scene.
  scene = new THREE.Scene();

  // Set up the camera.
  camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Set the z position to 80.
  camera.position.z = 80

  //Create a renderer with anti aliasing.
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // Set the size equal to the window size.
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add the render dom element to the document.
  document.body.appendChild(renderer.domElement);

  // Create the geomerty of the cube.
  var cubeGeometry = new THREE.BoxGeometry(20, 20, 20);

  // Create the cube using the geomerty and the material.
  cube = new THREE.Mesh(cubeGeometry, stemMaterial);

  // Add the cube to the scene.
  scene.add(cube);

}

function render () {

  // Request an animation frame with render.
  requestAnimationFrame(render);

  //Set the x rotation to 0.01;
  cube.rotation.x += 0.01;

  //Set the y rotation to 0.01;
  cube.rotation.y += 0.01;

  // Render with the scene and camera.
  renderer.render(scene, camera);
}