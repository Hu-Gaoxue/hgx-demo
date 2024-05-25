import * as THREE from 'three';

//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象
const texture = texLoader.load('./src/assets/earth.jpg');
// 环境
const textureCube = new THREE.CubeTextureLoader()
.setPath('../src/assets/env/')
.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

const geometry = new THREE.SphereGeometry( 30);
const material = new THREE.MeshPhongMaterial({
  map: texture,
  transparent:true,
  //envMap: textureCube,
  opacity:0.8,
});

const mesh = new THREE.Mesh(geometry, material);
// mesh.material.envMap = null;
export default mesh;
