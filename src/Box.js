'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';

export default class Box extends SceneObject {

  constructor(level, x, y, z, texturesrc, scale=1, mass=1){
    super(level, x, y, z, texturesrc, new THREE.BoxGeometry( scale, scale, scale ), null, scale, mass);
    if(this.level.physics_enabled)
      this.initPhysics(scale, this.mass, new CANNON.Box(new CANNON.Vec3(this.scale*0.5, this.scale*0.5, this.scale*0.5)) );
  }

}
