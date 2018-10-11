'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class Light {

  constructor(scene, x, y, z, source) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.scene = scene;
    // default to soft white ambient light
    this.source = (source == null)? new THREE.AmbientLight( 0x404040 ):source;
  }

  addToScene(){
    this.scene.scene.add(this.source);
  }

}
