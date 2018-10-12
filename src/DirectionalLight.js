'use-strict';

import * as THREE from 'three';
import SceneObject from './SceneObject';

export default class DirectionalLight extends SceneObject{

  constructor(scene, x=0, y=10, z=0, color=0xffffff, intensity=1) {
    let source = new THREE.DirectionalLight(color, intensity);
    source.position.set( x, y, z ); 
    super(scene, x,y,z, source)
  }

  addShadow(){
    //Set up shadow properties for the light
    this.threeObject.castShadow = true;
    // this.threeObject.shadow.camera = new THREE.OrthographicCamera( -100, 100, this.y, -1, 0.5, 1000 );
    // this.threeObject.shadow.camera.bottom = -1;
    // this.threeObject.shadow.camera.lefts = -1000;
    this.threeObject.shadow.mapSize.width = 512;
    this.threeObject.shadow.mapSize.height = 512;
    this.threeObject.shadow.camera.near = 0.5;    // default
    this.threeObject.shadow.camera.far = 5000;     // default	
  }

  addHelper(size=5){
    this.scene.scene.add( new THREE.DirectionalLightHelper( this.threeObject, size ) );
    this.scene.scene.add(new THREE.CameraHelper( this.threeObject.shadow.camera ))
  }

}
