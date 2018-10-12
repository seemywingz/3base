'use-strict';

import * as THREE from 'three';
import SceneObject from './SceneObject';

export default class DirectionalLight extends SceneObject{

  constructor(scene, x=0, y=1, z=0, color=0xffffff, intensity=1.0) {
    let source = new THREE.DirectionalLight(color, intensity);
    source.position.set( x, y, z ); 
    super(scene, x,y,z, source)
  }

  addShadow(left=-100, right=100, top=100, bottom=-100){
    //Set up shadow properties for the light
    this.threeObject.castShadow = true;
    this.threeObject.shadow.camera.left = left;
    this.threeObject.shadow.camera.right = right;
    this.threeObject.shadow.camera.top = top;
    this.threeObject.shadow.camera.bottom = bottom;
    this.threeObject.shadow.camera.far = 10000;
  }

  addHelper(size=5){
    this.scene.scene.add( new THREE.DirectionalLightHelper( this.threeObject, size ) );
    this.scene.scene.add(new THREE.CameraHelper( this.threeObject.shadow.camera ))
  }

}
