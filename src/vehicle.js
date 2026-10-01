import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export async function createVehicle(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  const gl = renderer.getContext();
  const rendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const rendererName = rendererInfo ? gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL) : '';

  if (!window.__FORCE_WEBGL__ && /swiftshader|llvmpipe|software rasterizer|microsoft basic render/i.test(rendererName)) {
    renderer.dispose();
    return null;
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
  camera.position.set(6.2, 3.5, 7.8);
  camera.lookAt(0, 0.65, 0);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x84988e, 2.8);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 4.2);
  key.position.set(4, 7, 5);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xa6eee5, 2.5);
  fill.position.set(-5, 3, -4);
  scene.add(fill);

  const top = new THREE.DirectionalLight(0xffffff, 2.0);
  top.position.set(0, 8, 2);
  scene.add(top);

  const car = new THREE.Group();
  scene.add(car);

  // Load custom metallic gray textures
  const textureLoader = new THREE.TextureLoader();
  const bodyGrayTexture = textureLoader.load('/assets/body-gray.png');
  bodyGrayTexture.flipY = false;
  bodyGrayTexture.colorSpace = THREE.SRGBColorSpace;

  const miscGrayTexture = textureLoader.load('/assets/misc-gray.png');
  miscGrayTexture.flipY = false;
  miscGrayTexture.colorSpace = THREE.SRGBColorSpace;

  const loader = new GLTFLoader();
  const gltf = await new Promise((resolve, reject) => {
    loader.load(
      '/assets/vehicle.glb',
      resolve,
      undefined,
      () => {
        loader.load(
          'https://media.umcaracaramelo.com.br/assets/models/2026/10/dbaadcfd-ded5-4609-b001-c9fa23c09185.glb',
          resolve,
          undefined,
          reject
        );
      }
    );
  });

  const model = gltf.scene;

  // Apply elegant metallic gray/silver finish and clean wheels
  model.traverse((child) => {
    if (child.isMesh && child.material) {
      if (child.material.name === 'sedan_body') {
        child.material.map = bodyGrayTexture;
        child.material.metalness = 0.72;
        child.material.roughness = 0.26;
        child.material.needsUpdate = true;
      } else if (child.material.name === 'sedan_miscellaneous') {
        child.material.map = miscGrayTexture;
        child.material.metalness = 0.65;
        child.material.roughness = 0.32;
        child.material.needsUpdate = true;
      }

      if (child.name && child.name.includes('numbers_id')) {
        child.visible = false;
      }
    }
  });

  const box = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  box.getCenter(center);

  model.position.x = -center.x;
  model.position.y = -box.min.y;
  model.position.z = -center.z;

  const inner = new THREE.Group();
  inner.add(model);
  inner.rotation.y = Math.PI / 2;

  // Larger car size (increased scale as requested)
  const CAR_SCALE = 1.05;
  inner.scale.setScalar(CAR_SCALE);
  car.add(inner);

  // Mercosul Plate texture
  const plateCanvas = document.createElement('canvas');
  plateCanvas.width = 256;
  plateCanvas.height = 96;
  const ctx = plateCanvas.getContext('2d');
  const plateTexture = new THREE.CanvasTexture(plateCanvas);
  plateTexture.colorSpace = THREE.SRGBColorSpace;

  function setPlate(value) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 96);
    ctx.fillStyle = '#29716f';
    ctx.fillRect(0, 0, 256, 22);
    ctx.fillStyle = '#fff';
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BRASIL', 128, 16);
    ctx.fillStyle = '#17231f';
    ctx.font = 'bold 45px Arial';
    ctx.fillText(value || 'ABC1D23', 128, 72);
    plateTexture.needsUpdate = true;
  }
  setPlate('ABC1D23');

  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.50, 0.18),
    new THREE.MeshBasicMaterial({ map: plateTexture, side: THREE.DoubleSide })
  );
  plate.rotation.y = Math.PI / 2;
  plate.position.set(2.52 * CAR_SCALE, 0.44 * CAR_SCALE, 0);
  plate.scale.setScalar((CAR_SCALE / 0.82) * 0.95);
  car.add(plate);

  let compiled = false;
  const parent = canvas.parentElement;
  function resize() {
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (compiled) renderer.render(scene, camera);
  }
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(parent);

  function render(progress = 0, focused = false, orbit = 0) {
    car.rotation.y = -0.15 + progress * 0.65 + orbit;
    car.position.y = Math.sin(progress * Math.PI) * 0.065;
    car.position.x = progress * 0.12;
    camera.position.y = 3.5 + Math.sin(progress * Math.PI) * 0.35;
    camera.lookAt(0, 0.65, 0);
    const scale = focused ? 1.015 : 1;
    car.scale.setScalar(scale);
    renderer.render(scene, camera);
  }

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    canvas.classList.remove('ready');
    parent.classList.remove('webgl-ready');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    render();
    canvas.classList.add('ready');
    parent.classList.add('webgl-ready');
  });

  await renderer.compileAsync(scene, camera);
  compiled = true;
  render();
  canvas.classList.add('ready');
  parent.classList.add('webgl-ready');

  return {
    render,
    setPlate,
    snapshot() {
      render(0.8);
      const data = canvas.toDataURL('image/png');
      render(0);
      return data;
    },
    dispose() {
      observer.disconnect();
      renderer.dispose();
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose();
        }
      });
      plateTexture.dispose();
      bodyGrayTexture.dispose();
      miscGrayTexture.dispose();
    }
  };
}
