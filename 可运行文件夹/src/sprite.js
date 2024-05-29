import * as THREE from 'three';
const vertices = [];

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position",new THREE.Float32BufferAttribute( vertices, 3 ));

parameters = [
    [[ 1.0, 0.2, 0.5 ], sprite2, 20 ],
    [[ 0.95, 0.1, 0.5 ], sprite3, 15 ],
    [[ 0.90, 0.05, 0.5 ], sprite1, 10 ],
    // [[ 0.85, 0, 0.5 ], sprite5, 8 ],
    [[ 0.80, 0, 0.5 ], sprite4, 5 ]
];

for ( let i = 0; i < parameters.length; i ++ ) {

    // const color = parameters[ i ][ 0 ];
    const sprite = parameters[ i ][ 1 ];
    const size = parameters[ i ][ 2 ];

    materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
    // materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ], THREE.SRGBColorSpace );

    const particles = new THREE.Points( geometry, materials[ i ] );

    particles.rotation.x = Math.random() * 6;
    particles.rotation.y = Math.random() * 6;
    particles.rotation.z = Math.random() * 6;

    scene.add( particles );

}
export default point;