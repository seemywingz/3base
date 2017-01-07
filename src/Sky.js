'use-strict';

import * as THREE from 'three';
import SceneObject from './SceneObject';

export default class Sky extends SceneObject {

  constructor(x, y, z, texturesrc, scale=1000){
    super(x, y, z, texturesrc, new THREE.SphereGeometry( scale, 32, 32 ), null);
    this.mesh.material.side = THREE.BackSide;
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
  }

}
