'use-strict';

import * as THREE from 'three';
// import * as CANNON from 'cannon';
import MeshObject from './MeshObject';

export default class GLTFModel extends MeshObject {

  constructor(scene, x, y, z, model, scale=1, mass=1, addToScene=false){
    super(scene, x, y, z, null, scale, mass);
    this.model = model;
    return this.loadGLTF(addToScene)
  }

  loadGLTF(addToScene){
    return new Promise((resolve, reject) => {
      this.scene.manager.glTFLoader.load(
        this.model + '/scene.gltf',
        ( gltf ) => {
          try{
            this.mesh = gltf.scene;
            this.gltf = gltf;
            gltf.scene.traverse( node => {
              if ( node instanceof THREE.Mesh ){
                node.castShadow = true; 
              }
            });
            this.configMesh();
            this.mesh.side = THREE.DoubleSide;
            this.threeObject = this.mesh;
          // if(this.scene.physicsEnabled && this.mass >= 0) {
          //   console.log(CANNON)
          //    var box = new CANNON.Box().setFromObject( this.mesh );
          //    let size = new THREE.Vector3;
          //    box.getSize(size);
          //    this.initPhysics(this.scale, this.mass, new CANNON.Box(new CANNON.Vec3(size.x*0.5, size.y*0.5, size.z*0.5)) );
          // }
            if (addToScene) {
              this.addToScene();
            }
            resolve(this);
         }catch(e){
          reject(e);
         }
        },
        (xhr) => {// on Load
          let percentLoaded = ( xhr.loaded / xhr.total * 100 )
          console.log( this.model + " " + percentLoaded + '% loaded' );
        },
        (e) => {// on Error
          console.log(e);
        }
      )
    });
  }

  playAnimation(aNum = 0){
    if( this.gltf.animations.length > 0){
      this.mixer = new THREE.AnimationMixer(this.mesh);
      this.mixer.clipAction(this.gltf.animations[aNum]).play();
    }
  }
}
