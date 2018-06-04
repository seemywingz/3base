'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';

export default class Ball extends SceneObject {

  constructor(level, x, y, z, texture, scale=1, mass=1){
    super(level, x, y, z, texture, new THREE.SphereGeometry( scale, 32, 32 ), null, scale, mass);
    if(this.level.physicsEnabled)
      this.initPhysics(this.scale, this.mass, new CANNON.Sphere(scale) );
  }

}
