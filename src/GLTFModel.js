'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';

export default class GLTFModel extends SceneObject {

  constructor(scene, x, y, z, model, scale=1, mass=1, addToScene=false){
    super(scene, x, y, z, null, scale, mass);
    this.model = model;
    return this.loadGLTF(addToScene)
  }

  loadGLTF(addToScene){
    return new Promise((resolve, reject) => {
      this.scene.loaders.glTFLoader.load(
        this.model + '/scene.gltf',
        ( gltf ) => {
          this.gltf = gltf;
          this.mesh = gltf.scene;
          this.configMesh();
          this.mesh.side = THREE.DoubleSide;
          if(this.scene.physicsEnabled && this.mass >= 0) {
             var box = new CANNON.Box3().setFromObject( this.mesh );
             let size = new THREE.Vector3;
             box.getSize(size);
             this.initPhysics(this.scale, this.mass, new CANNON.Box(new CANNON.Vec3(size.x*0.5, size.y*0.5, size.z*0.5)) );
          }
          if (addToScene) {
            this.scene.scene.add(this.mesh);
          }
          resolve(this);
        },
        (xhr) => {// on Load
          let percentLoaded = ( xhr.loaded / xhr.total * 100 )
          console.log( this.model + " " + percentLoaded + '% loaded' );
        },
        (e) => {// on Error
          console.log(e);
          reject();
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
