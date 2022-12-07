import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import { ToonShaderDotted } from "three/addons/shaders/ToonShader.js";

let controls: OrbitControls;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let frameId = 0;
let lastFrame = 0;
let time = 0;
let effect: MarchingCubes;

function init(canvas: HTMLCanvasElement) {
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    35,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000,
  );
  // camera.position.z = 2;
  camera.position.set(15, 15, 15);
  scene.add(camera);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x000000);
  scene.add(ambientLight);
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0.5, 0.5, 1);
  scene.add(light);

  // Spheres
  const dottedMaterial = createShaderMaterial(
    ToonShaderDotted,
    light,
    ambientLight,
  );

  // const axesHelper = new THREE.AxesHelper(5000);
  // scene.add(axesHelper);

  // MARCHING CUBES

  const resolution = 48;

  effect = new MarchingCubes(
    resolution,
    dottedMaterial,
    true,
    false,
    10000,
  );
  effect.position.set(0, 0, 0);
  effect.scale.set(7, 7, 7);
  effect.isolation = 50;

  scene.add(effect);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false
  controls.enableZoom = false
  controls.rotateSpeed = 0.2

  // Start loop
  frameId = requestAnimationFrame(animate);
}

function animate(timestamp: number) {
  frameId = requestAnimationFrame(animate);

  const secondsPassed = Math.min((timestamp - lastFrame) / 1000, 0.1);
  time += secondsPassed * 0.2;
  lastFrame = timestamp;

  if (resizeRenderer(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  updateCubes(8);

  controls.update();

  render();
}

function render() {
  renderer.render(scene, camera);
}

function cleanup() {
  cancelAnimationFrame(frameId);
}

function updateCubes(numblobs: number) {
  effect.reset();

  // fill the field with some metaballs
  const subtract = 12;
  const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);
  // const strength = 2;

  for (let i = 0; i < numblobs; i++) {
    const ballx =
      Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 +
      0.5;
    const bally =
      Math.sin(i + 1.32 * time * 0.1 * Math.cos(0.92 + 0.53 * i)) * 0.27 + 0.5;
    const ballz =
      Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.27 + 0.5;

    effect.addBall(ballx, bally, ballz, strength, subtract);
  }

  effect.update();
}

function createShaderMaterial(
  shader: THREE.Shader,
  light: THREE.DirectionalLight,
  ambientLight: THREE.AmbientLight,
) {
  const uniforms = THREE.UniformsUtils.clone(shader.uniforms);

  const { vertexShader, fragmentShader } = shader;

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  material.uniforms["uDirLightPos"].value = light.position;
  material.uniforms["uDirLightColor"].value = light.color;

  material.uniforms["uAmbientLightColor"].value = ambientLight.color;

  material.uniforms["uBaseColor"].value = new THREE.Color(0xff6347);

  return material;
}

function resizeRenderer(renderer: THREE.WebGLRenderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export { cleanup, init };
