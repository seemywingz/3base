'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';
import { physic_enabled } from './init';

export default class Box extends SceneObject {

  constructor(x, y, z, texturesrc, scale=1, mass=1){
    super(x, y, z, texturesrc, new THREE.BoxGeometry( scale, scale, scale ), null);
    if(physic_enabled)
      this.initPhysics(scale, mass, new CANNON.Box(new CANNON.Vec3(scale*0.5, scale*0.5, scale*0.5)) );
  }
  
}
