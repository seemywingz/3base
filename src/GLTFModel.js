'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';

export default class GLTFModel extends SceneObject {

  constructor(level, x, y, z, model, scale=1, mass=1){
    super(level, x, y, z, null, scale, mass);
    this.model = model;
    this.loadGLTF();
  }

  loadGLTF(addToScene = false){
    return this.level.loaders.glTFLoader.load(
      './assets/models/' + this.model + '/scene.gltf',
      ( gltf ) => {
        this.gltf = gltf;
        this.mesh = gltf.scene;
        this.configMesh();
        this.mesh.side = THREE.DoubleSide;
        if(this.level.physicsEnabled && this.mass >= 0) {
           var box = new CANNON.Box3().setFromObject( this.mesh );
           let size = new THREE.Vector3;
           box.getSize(size);
           this.initPhysics(this.scale, this.mass, new CANNON.Box(new CANNON.Vec3(size.x*0.5, size.y*0.5, size.z*0.5)) );
        }
      },
      () => {
        if (addToScene){
          this.level.scene.add(this.mesh);
        }
      },
      (e) => {console.log(e)}
    );
  }

  playAnimation(aNum = 0){
    if( this.gltf.animations.length > 0){
      this.mixer = new THREE.AnimationMixer(this.mesh);
      this.mixer.clipAction(this.gltf.animations[aNum]).play();
    }
  }
}
