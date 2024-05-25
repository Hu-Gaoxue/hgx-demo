//旋转地球
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import model from "./Sphere";

let camera, scene, renderer, stats, gui;

function init(){
    //场景
    scene = new THREE.Scene();

    //添加物体
    scene.add(model)

    //相机
    camera = new THREE.PerspectiveCamera(
        90,  // 视野角度
        window.innerWidth / window.innerHeight,  //长宽比
        0.1,  //近截面
        1000,  //远截面
    );
    camera.position.set(50,50,50);
    camera.lookAt(0,0,0);

    //光源
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(30, 30, 30);
    pointLight.decay = 0;  //设置光源不随距离衰减
    scene.add(pointLight);

    // 点光源辅助观察
    const pointLightHelpler = new THREE.PointLightHelper(pointLight);
    scene.add(pointLightHelpler);

    //环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    //渲染器
    renderer = new THREE.WebGLRenderer({antialias:true,});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.render(scene,camera);
    
    document.body.appendChild(renderer.domElement);

    //监听自适应窗口
    // window.addEventListener('resize',onWindowResize);
    window.onresize = onWindowResize;

    //视图辅助
    initHelper();

    initGUI(pointLight,ambientLight);
}

function animate(){
    //浏览器刷新的时候浏览器重新渲染
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
    // 立方体旋转
    model.rotation.x += 0.01;
    model.rotation.y += 0.01;
    stats.update();
}

//窗口被调整大小时发生
function onWindowResize(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

//视图辅助
function initHelper(){
    //坐标轴辅助线
    const axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);
    //轨道控制器
    const constrols = new OrbitControls(camera,renderer.domElement);
    constrols.addEventListener('change',() => {
        renderer.render(scene,camera);
    })

    //参数1 网格大小 参数2 分成几份 参数3  中心轴颜色 参数4 网格线的颜色
    const gridHelper = new THREE.GridHelper(1000,100,0x000000,0x0000ff);
    scene.add(gridHelper);

    //创建stats对象
    stats = new Stats();
    //stats.domElement:web页面上输出计算结果,一个div元素，
    document.body.appendChild(stats.domElement);
}

function initGUI(pointLight,ambientLight){
    const gui = new GUI();
    // const obj = {
    //     x: 1
    // }
    // //滑动条
    // gui.add(obj, 'x', -10, 10, 1).name('x的值');
    // gui.add(ambientLight, 'intensity', 0, 2).name('环境光强度');
    // console.log("gui -->",gui);
    // //改变颜色
    // gui.addColor(model.material,'color').name('color');
    // //改变位置 下拉菜单
    // gui.add(model.position,'x',[0,1,2,4,8]);
    // gui.add(model.position,'x',{
    //     min:-10,
    //     max:10,
    // });

    const objectFolder = gui.addFolder("物体");

    const positionFolder = gui.addFolder("位置");
    positionFolder.add(model.position,'x',-100,100,1).name('X坐标');
    positionFolder.add(model.position,'y',-100,100,1).name('Y坐标');
    positionFolder.add(model.position,'z',-100,100,1).name('Z坐标');

    const materialFolder = gui.addFolder("材质");
    materialFolder.addColor(model.material,'color').name('颜色');
    materialFolder.add(model.material,'transparent').name('是否透明');
    materialFolder.add(model.material,'opacity',0,1).name('透明度');

    const lightFolder = gui.addFolder("光源");
    const pointLightFolder= lightFolder.addFolder('点光源');
    pointLightFolder.addColor(pointLight,'color').name('颜色');
    pointLightFolder.add(pointLight, 'intensity', 0, 100).name('强度');
    pointLightFolder.add(pointLight.position, 'x', -100,100,1).name('X坐标');
    pointLightFolder.add(pointLight.position, 'y', -100,100,1).name('Y坐标');
    pointLightFolder.add(pointLight.position, 'z', -100,100,1).name('Z坐标');
    const ambientLightFolder= lightFolder.addFolder("环境光");
    ambientLightFolder.addColor(ambientLight, 'color').name('颜色');
    ambientLightFolder.add(ambientLight, 'intensity', 0, 10).name('强度');

    //const envMapFolder = gui.addFolder("纹理");
    // envMapFolder.add(model.material,'envMap',0,1).name('材质1');

    // 执行方法
    const settings = {
        clear() {
            gui.children[1].reset(); // 清除
            gui.children[2].reset(); // 清除
            gui.children[3].reset(); // 清除
        },
        setDefault() {
    
        }
    };
    gui.add(settings, 'clear');
    gui.add(settings, 'setDefault'); // 重置到默认值
    
}

init();
animate();