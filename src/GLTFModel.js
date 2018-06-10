'use-strict';

import { 
  Box3,
  Vector3,
  DoubleSide,
  AnimationMixer
} from 'three';
import {Box, Vec3} from 'cannon';
import SceneObject from './SceneObject';
import { glTFLoader } from './LevelLoader';

export default class GLTFModel extends SceneObject {

  constructor(level, x, y, z, model, scale=1, mass=1){
    super(level, x, y, z, null, scale, mass);
    this.loadGLTF(model);
  }

  loadGLTF(model){
    glTFLoader.load(
      './assets/models/' + model + '/scene.gltf',
      ( gltf ) => {
        // console.log(gltf);
        this.gltf = gltf;
        this.mesh = gltf.scene;
        this.configMesh();
        this.mesh.side = DoubleSide;
        if(this.level.physicsEnabled && this.mass >= 0) {
           var box = new Box3().setFromObject( this.mesh );
           let size = new Vector3;
           box.getSize(size);
           this.initPhysics(this.scale, this.mass, new Box(new Vec3(size.x*0.5, size.y*0.5, size.z*0.5)) );
        }
        if( this.gltf.animations.length > 0){
          this.mixer = new AnimationMixer(this.mesh);
          this.mixer.clipAction(gltf.animations[0]).play();
        }
        this.level.scene.add(gltf.scene);
      },
      () => {},
      (e) => {console.log(e)}
    );
  }
}
