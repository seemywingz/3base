'use-strict';

import * as THREE from 'three';
import SceneObject from './SceneObject';

export default class Sky extends SceneObject {

  constructor(level, x, y, z, texturesrc, scale){
    scale = scale <= 0 ? 1 : scale;
    super(level, x, y, z, texturesrc, new THREE.SphereGeometry( scale, 32, 32 ), null, scale);
    this.mesh.material.side = THREE.BackSide;
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
  }

}
