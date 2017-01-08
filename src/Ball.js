'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';
import { physic_enabled } from './init';

export default class Ball extends SceneObject {

  constructor(x, y, z, texturesrc, scale=1, mass=1){
    super(x, y, z, texturesrc, new THREE.SphereGeometry( scale, 32, 32 ), null);
    if(physic_enabled)
      this.initPhysics(scale, mass, new CANNON.Sphere(scale) );
  }

}
