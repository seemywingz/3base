'use-strict';

import * as THREE from 'three';
import SceneObject from './SceneObject';

export default class PointLight extends SceneObject{

  constructor(scene, x=0, y=0, z=0, color=0xffffff, intensity=1, distance=0, decay=2) {
    let source = new THREE.PointLight(color, intensity, distance, decay);
    source.position.set(x, y, z);
    source.castShadow = true;
    super(scene, x,y,z, source)
  }

  addHelper(size=5){
    let helper = new THREE.PointLightHelper( this.threeObject, size );
    this.scene.scene.add( helper );
  }

}
