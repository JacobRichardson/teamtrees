/** 
 * This module is responsible for rending the trees on the page.
 */

// Globals.

// The api key.
const API_KEY = '';

// The api url.
const API_URL = "https://wrapapi.com/use/JacobRichardson/teamtrees/treecount/0.0.1";

// Constant for the planet's radius.
const PLANET_RADIUS = 35;

// Various three.js global variables
var scene,
  camera,
  renderer,
  controls,
  group;

// Set current trees to 17 million.
const currentTrees = 17000000;

// Variable for the number of trees.
let numTrees;

/** 
 * Creates everything necessary for displaying
 * the tree.
 */
function init () {

  // Fetch the current tree count.
  fetchTreeCount();

  // Fetch the tree count regularly.
  setInterval(fetchTreeCount, 30000);

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

  // Invoke add lights with the scene.
  addLights(scene);

  // Orbital controls (rotation)
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.update();

  // Create the planet using the planet function and the radius.
  var planetObject = planet(PLANET_RADIUS);

  // Add the planet to the scene.
  scene.add(planetObject);

  // If the api key is empty.
  if (API_KEY === '') {

    // Grow trees equal to the current tree count.
    growTrees(currentTrees / 10000);
  }
}

/**
 * This handles rendering the scene.
 */
function render () {

  // Request an animation frame with render.
  requestAnimationFrame(render);

  // Render with the scene and camera.
  renderer.render(scene, camera);
}

/** 
 * Fetches trees if there is an api key.
 */
function fetchTreeCount () {

  // If api key is an empty string.
  if (API_KEY === '') {

    // Set cash equal to the number of trees.
    return $("#cash").text("$" + formatNumber(currentTrees));
  }

  // Create an post request with the url and the api key.
  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      "wrapAPIKey": API_KEY
    }
  }).done(function (data) {

    // If the request was successful.
    if (data.success) {

      // Set num trees equal to the data of total trees.
      numTrees = data["data"]["#totalTrees"];

      // Set cash equal to the number of trees.
      $("#cash").text("$" + formatNumber(numTrees))

      // Create a tree per 10,000 and remove how many current trees we have.
      var diff = Math.floor(numTrees / 10000) - currentTrees

      // If diff is greater than 0.
      if (diff > 0) {

        // Increment current tress by diff.
        currentTrees += diff

        // Grow that many trees.
        growTrees(diff)
      }
    }
  });
}


/**
 * Formats a number to a currency.
 * @param {Number} num The number to be formated.
 * @returns {String} The formated string value.
 */
function formatNumber (num) {

  // Return a string version of the number replacing information.
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}


/**
 * Creates a tree to be render.
 * @returns {Object} A tree.
 */
function tree (angles) {

  // Create the geometry of the cube.
  var geometry = new THREE.BoxGeometry(1, 1, 1);

  // Leaf material
  var leafMaterial = new THREE.MeshLambertMaterial({ color: 0x91E56E });
  var stemMaterial = new THREE.MeshLambertMaterial({ color: 0x7D5A4F });

  // Create the stem, set the position, and set the scale.
  var stem = new THREE.Mesh(geometry, stemMaterial);
  stem.position.set(0, PLANET_RADIUS + 0.75, 0);
  stem.scale.set(0.3, 2.5, 0.3);

  // Create the leaf, set the position, and set the scale.
  var leaf = new THREE.Mesh(geometry, leafMaterial);
  leaf.position.set(0, PLANET_RADIUS + 1.45, 0);
  leaf.scale.set(1, 1, 1);

  // Create a new group and add the leaf and stem.
  var tree = new THREE.Group();
  tree.add(leaf);
  tree.add(stem);

  // Set the rotation.
  tree.rotation.set(angles[0], angles[1], angles[2]);

  // Return the new tree.
  return tree
}

/** 
 * Generates a planet at (0,0,0) based on the radius.
 * @param {Number} radius The size of the planet.
 * @return {Object} The planet.
 */
function planet (radius) {

  // Ground material.
  var groundMaterial = new THREE.MeshLambertMaterial({ color: 0x634b35 });

  // Create the planet geometry based on the radius..
  var planetGeometry = new THREE.SphereGeometry(radius, 100, 100);

  // Create the planet with the mesh and geometry.
  var planet = new THREE.Mesh(planetGeometry, groundMaterial);

  // Set the position to 0, 0, 0.
  planet.position.set(0, 0, 0);

  // Return the planet.
  return planet;
}

/**
 * Add lights to the scene.
 */
function addLights () {

  // Lights.
  var light = new THREE.DirectionalLight(0xEEFFD3, 1);
  var light2 = new THREE.DirectionalLight(0xFF0000, 0.4);
  var light3 = new THREE.DirectionalLight(0xFFFFFF, 0.2);

  // Set the lights to different positions.
  light.position.set(0, 1, 0);
  light2.position.set(1, 0, 0);
  light3.position.set(0, 0, 1);

  // Add them to the scene.
  scene.add(light);
  scene.add(light2);
  scene.add(light3);
}

/** 
 * Add a specified number of trees to the planet.
 * @param {Number} n The number of trees to create.
 */
function growTrees (n) {

  // For i until n.
  for (var i = 0; i < n; i++) {

    // Add the tree to the scene using a random triple.
    scene.add(tree(randomAngleTriple()))
  }
}

/**
 * Generates a random triple.
 * @returns {Array<Number>} A random triple
 */
function randomAngleTriple () {
  return [
    2 * Math.PI * Math.random(),
    2 * Math.PI * Math.random(),
    2 * Math.PI * Math.random()
  ]
}

// Invoke init.
init();

// Invoke render.
render();