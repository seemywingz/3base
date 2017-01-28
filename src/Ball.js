'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';
import levelLoader from './LevelLoader';

export default class Ball extends SceneObject {

  constructor(level, x, y, z, texturesrc, scale=1, mass=1){
    super(level, x, y, z, texturesrc, new THREE.SphereGeometry( scale, 32, 32 ), null);
    if(this.level.physics_enabled) this.initPhysics(scale, mass, new CANNON.Sphere(scale) );
    this.level.animatedObjects.push(this);
  }

}
