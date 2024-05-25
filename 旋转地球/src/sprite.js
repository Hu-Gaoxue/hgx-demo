import * as THREE from 'three';

function getTexture(){
    // var texture=new THREE.TextureLoader().load("./src/assets/2.png");
    return texture;
}
const sphere=new THREE.SphereGeometry(50);
const cube=new THREE.BoxGeometry(100,100,100,10,10,10);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position",cube.getAttribute('position'));

const material=new THREE.PointsMaterial({
    map:getTexture(),
    size:1,
    transparent:true,

})
const point=new THREE.Points(geometry,material);
export default point;