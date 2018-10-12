'use-strict';

import * as THREE from 'three';
import SceneObject from './SceneObject';

export default class AmbientlLight extends SceneObject{

  constructor(scene, color=0xffffff, intensity=1) {
    let source = new THREE.AmbientLight(color, intensity);
    super(scene, 0,0,0, source)
  }

}
