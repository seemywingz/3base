'use-strict';

import * as THREE from 'three';

export default class Camera{

  constructor(x=0, y=0, z=0){
    this.lens = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100000 );
    this.lens.position.x = x;
    this.lens.position.y = y;
    this.lens.position.z = z;
  }

}