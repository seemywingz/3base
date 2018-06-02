'use-strict';

import * as THREE from 'three';

export default class Camera{

  constructor(x=0, y=0, z=0){
    this.lens = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100000 );
    this.lens.position.x = x;
    this.lens.position.y = y;
    this.lens.position.z = z;

    // this.controls = new THREE.FirstPersonControls(this.lens);
    // this.controls.lookSpeed = 0.4;
    // this.controls.movementSpeed = 20;
    // this.controls.noFly = true;
    // this.controls.lookVertical = true;
    // this.controls.constrainVertical = true;
    // this.controls.verticalMin = 1.0;
    // this.controls.verticalMax = 2.0;
    // this.controls.lon = -150;
    // this.controls.lat = 120;
  }

}