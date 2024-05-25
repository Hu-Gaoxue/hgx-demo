import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import model from "./cube.js";


let camera, scene, renderer, gui;

function init() {
  scene = new THREE.Scene();

  scene.add(model);
  // 创建相机 使用的是 PerspectiveCamera（透视摄像机）
  camera = new THREE.PerspectiveCamera(
    75, // 视野角度（FOV）
    window.innerWidth / window.innerHeight, // 长宽比（aspect ratio）
    0.1, // 近截面（near）
    1000 // 远截面（far）
  );
  // 设置相机摆放的位置
  camera.position.set(50, 50, 50);
  // 设置相机看向的位置
  camera.lookAt(0, 0, 0);

  // const pointLight = new THREE.PointLight(0xffffff, 1.0);
  // pointLight.intensity = 1.0;//光照强度
  // pointLight.decay = 0.0;//设置光源不随距离衰减
  // scene.add(pointLight); //点光源添加到场景中

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize);
  //window.onresize=onWindowResize;
  initHelper();
initGUI(ambientLight);
}

function animate() {
  renderer.render(scene, camera);

  // 立方体旋转
  model.rotateX(0.01);
  model.rotateY(0.01);
  requestAnimationFrame(animate);
}


function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function initHelper() {
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', function () {
    renderer.render(scene, camera); //执行渲染操作
  }); //监听鼠标、键盘事件

  const gridHelper = new THREE.GridHelper(1000, 100, 0x000000, 0x004444);
  scene.add(gridHelper);

  const stats = new Stats();
  document.body.appendChild(stats.domElement);
}


function initGUI(ambientLight) {
  const gui = new GUI();
  const obj = {
    x: 30
  }

  gui.add(obj, 'x', 0, 100)

  gui.add(ambientLight, 'intensity', 0.1, 2).name('环境光强度').step(0.1).onChange((value) => {
    console.log(value);
  });

  gui.addColor(model.material, 'color').name('颜色')

  // 下拉菜单、单选框
  gui.add(model.position, 'x', [0, 1, 2, 4, 8]);
  gui.add(model.position, 'x', {
    min: -10,
    max: 10,
  });
  // 布尔值设置单选框
  gui.add(model.material, 'transparent').name('是否透明');

  // 分组、嵌套
  gui.addFolder()

  // 执行方法
  const settings = {
    clear() {
      gui.children[1].reset(); // 重置
    },
  };
  gui.add(settings, 'clear');

  // 关闭打开菜单
  gui.close()
  gui.open()
}

init();
animate();
