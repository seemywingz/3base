'use-strict';

import * as THREE from 'three';

export default class SceneObject {

  constructor(scene, x=0, y=0, z=0, threeObject=new THREE.Object3D()){
    this.x = x;
    this.y = y;
    this.z = z;
    this.scene = scene;
    this.threeObject = threeObject;
  }

  addToScene(){
    this.scene.scene.add(this.threeObject);
  }

  setPosition(x, y, z){
    this.threeObject.position.set(this.x = x, this.y = y, this.z = z);
  }
}
