'use-strict';

import * as THREE from 'three';
import SceneObject from './SceneObject';

export default class HemisphereLight extends SceneObject{

  constructor(scene, skyColor=0xffffff, groundColor=0x565656, intensity=1) {
    let source = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    super(scene, 0,0,0, source)
  }

}
