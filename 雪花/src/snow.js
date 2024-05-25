import * as THREE from 'three';
import point from './sprite.js'
let camera, scene, renderer, stats;
function init() {
  // 场景
  scene = new THREE.Scene();

  //添加物体
  // scene.add(model);
  scene.add(point);
  // 相机
  camera = new THREE.PerspectiveCamera(
    90, // 视野角度
    window.innerWidth / window.innerHeight, // 长宽比
    0.1, // 近截面（near）
    1000 // 远截面（far）
  );
  camera.position.set(50, 50, 50);
  camera.lookAt(0, 0, 0);

  // 光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // 渲染器
  renderer = new THREE.WebGLRenderer({antialias: true});
  // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);
  // window.addEventListener('resize', onWindowResize);
  window.onresize = onWindowResize;
  initHelper();
}

function animate() {
  // 浏览器刷新的时候渲染器重新渲染
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  stats.update();
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
  camera.updateProjectionMatrix();
}

function initHelper() {
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', () => {
    renderer.render(scene, camera);
  });

  const gridHelper = new THREE.GridHelper(1000, 100);
  scene.add(gridHelper);

  //创建stats对象
  stats = new Stats();
  //stats.domElement:web页面上输出计算结果,一个div元素，
  document.body.appendChild(stats.domElement);
}

init();
animate();