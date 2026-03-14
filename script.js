import * as THREE from "three";
import vertexShader from "./vertexShader.js";
import fragmentShader from "./fragmentShader.js";

const canvas = document.getElementById("glslBlackHoleCanvas");
const scene = new THREE.Scene();

const width = canvas.clientWidth;
const height = canvas.clientHeight;
const aspectRatio = width / height;

const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas });

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);

const fovRadians = THREE.MathUtils.degToRad(camera.fov);
const yFov = camera.position.z * Math.tan(fovRadians / 2) * 2;

const canvasGeometry = new THREE.PlaneGeometry(yFov * camera.aspect, yFov);
const canvasMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uResolution:   { value: new THREE.Vector2(width, height)},
    uTime:         { value: 0,},
    uCamPos:       { value: new THREE.Vector3(0, 0, -8)},
    uBlackHolePos: { value: new THREE.Vector3(0, 0, 0)},
    uRotation:     { value: new THREE.Vector3(THREE.MathUtils.degToRad(-4), 0, THREE.MathUtils.degToRad(-15))},
  },
  vertexShader,
  fragmentShader,
});

const canvasMesh = new THREE.Mesh(canvasGeometry, canvasMaterial);
scene.add(canvasMesh);

renderer.setAnimationLoop(time => {
  canvasMaterial.uniforms.uTime.value = time * 0.001;
  renderer.render(scene, camera);
});

const downloadButton = document.createElement("button");
downloadButton.textContent = "Download image";
document.body.appendChild(downloadButton);

downloadButton.addEventListener("click", () => {
  renderer.render(scene, camera); // make sure last frame has been rendered

  const link = document.createElement("a");
  link.download = "blackhole.png";
  link.href = renderer.domElement.toDataURL("image/png");
  link.click();
});
