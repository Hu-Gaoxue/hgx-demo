import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 场景设置
const scene = new THREE.Scene();

// 加载云朵贴图
const cloudTexture = new THREE.TextureLoader().load('src/textures/cloud.png');

// 创建云朵材质
const cloudMaterial = new THREE.SpriteMaterial({ map: cloudTexture, color: 0xffffff });

// 创建多个云朵
for (let i = 0; i < 10; i++) {
    // 在场景中随机设置云朵位置
    const cloud = new THREE.Sprite(cloudMaterial);
    cloud.position.set(
        Math.random() * 200 - 100,  // X 坐标
        Math.random() * 30 + 20,    // Y 坐标（离地面的高度）
        Math.random() * 200 - 100   // Z 坐标
    );
    cloud.scale.set(20, 10, 1); // 根据需要调整云朵大小
    scene.add(cloud);
}

// 相机设置
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 50);  // 调整摄像机初始位置
camera.lookAt(0, 0, 0);  // 使摄像机朝向场景中心

// 渲染器设置
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 地面设置
const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const obstacles = []; // 存储所有障碍物的数组
const carrots = []; // 存储胡萝卜模型的数组

// 创建树的函数
function createTree(x, z) {
    const trunkGeometry = new THREE.CylinderGeometry(1, 1, 10, 32);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 5, z);

    const leavesGeometry = new THREE.SphereGeometry(5, 32, 32);
    const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(x, 15, z);

    scene.add(trunk);
    scene.add(leaves);

    obstacles.push(trunk);
    obstacles.push(leaves);
}

// 添加多个树
for (let i = 0; i < 100; i++) {
    const x = Math.random() * 200 - 100;
    const z = Math.random() * 200 - 100;
    createTree(x, z);
}

// 创建石头的函数
function createRock(x, z) {
    const rockGeometry = new THREE.DodecahedronGeometry(3, 0);
    const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.set(x, 3, z);

    scene.add(rock);

    obstacles.push(rock);
}

// 添加多个石头
for (let i = 0; i < 50; i++) {
    const x = Math.random() * 200 - 100;
    const z = Math.random() * 200 - 100;
    createRock(x, z);
}

// 光照设置
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(50, 50, 50);
scene.add(directionalLight);

// 天空盒设置
const skyGeometry = new THREE.BoxGeometry(500, 500, 500);
const skyMaterials = [
    'right.jpg', 'left.jpg', 'top.jpg', 'bottom.jpg', 'front.jpg', 'back.jpg'
].map(texture => new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(`src/textures/${texture}`),
    side: THREE.DoubleSide
}));

const skyBox = new THREE.Mesh(skyGeometry, skyMaterials);
scene.add(skyBox);

// 加载GLTF模型
let rabbitModel;
const loader = new GLTFLoader();
loader.load(
    'src/models/rabbit.gltf',  // 替换为你的模型路径
    (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);  // 根据需要调整模型位置
        model.scale.set(100, 100, 100);  // 放大模型
        scene.add(model);
        rabbitModel = model; // 存储模型的引用
        console.log('Rabbit model loaded successfully');
    },
    undefined,
    (error) => {
        console.error('An error occurred while loading the rabbit model:', error);
    }
);

// 加载胡萝卜模型并生成10个随机散落在场景中
const carrotLoader = new GLTFLoader();
carrotLoader.load(
    'src/models/carrot.gltf',  // 替换为你的胡萝卜模型路径
    (gltf) => {
        for (let i = 0; i < 10; i++) {
            const carrot = gltf.scene.clone();
            carrot.position.set(
                Math.random() * 200 - 100, // X 坐标
                0,                          // Y 坐标
                Math.random() * 200 - 100   // Z 坐标
            );
            carrot.scale.set(20, 20, 20); // 放大模型
            scene.add(carrot);
            carrots.push(carrot);
        }
        console.log('Carrot models loaded successfully');
    },
    undefined,
    (error) => {
        console.error('An error occurred while loading the carrot model:', error);
    }
);

// 碰撞检测函数
function checkCollision(newPosition) {
    const rabbitBox = new THREE.Box3().setFromObject(rabbitModel);
    rabbitBox.translate(newPosition.clone().sub(rabbitModel.position));

    for (let obstacle of obstacles) {
        const obstacleBox = new THREE.Box3().setFromObject(obstacle);
        if (rabbitBox.intersectsBox(obstacleBox)) {
            return true; // 碰撞发生
        }
    }
    return false; // 没有碰撞
}

// 检查胡萝卜碰撞
function checkCarrotCollision() {
    const rabbitBox = new THREE.Box3().setFromObject(rabbitModel);
    for (let i = carrots.length - 1; i >= 0; i--) {
        const carrotBox = new THREE.Box3().setFromObject(carrots[i]);
        if (rabbitBox.intersectsBox(carrotBox)) {
            scene.remove(carrots[i]);
            carrots.splice(i, 1);
        }
    }
}

// 键盘控制兔子模型移动以及摄像机跟随兔子移动
document.addEventListener('keydown', (event) => {
    const speed = 1; // 移动速度
    if (!rabbitModel) return; // 如果模型未加载，则退出

    const newPosition = rabbitModel.position.clone();

    switch (event.key) {
        case 'ArrowUp':
            newPosition.z -= speed;
            break;
        case 'ArrowDown':
            newPosition.z += speed;
            break;
        case 'ArrowLeft':
            newPosition.x -= speed;
            break;
        case 'ArrowRight':
            newPosition.x += speed;
            break;
    }

    // 限制兔子移动范围
    const minX = -100;
    const maxX = 100;
    const minZ = -100;
    const maxZ = 100;

    newPosition.x = Math.max(minX, Math.min(maxX, newPosition.x));
    newPosition.z = Math.max(minZ, Math.min(maxZ, newPosition.z));

    // 检查碰撞
    if (!checkCollision(newPosition)) {
        rabbitModel.position.copy(newPosition);
    }

    // 检查胡萝卜碰撞
    checkCarrotCollision();

    // 调整摄像机位置
    const offset = new THREE.Vector3(0, 10, 50); // 摄像机相对于兔子的位置偏移量
    const cameraPos = rabbitModel.position.clone().add(offset); // 计算摄像机位置
    camera.position.copy(cameraPos);

    // 让摄像机始终朝向兔子
    camera.lookAt(rabbitModel.position);
});

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// 处理窗口大小变化
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
