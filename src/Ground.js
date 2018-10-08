'use-strict';

import * as THREE from 'three';
import {
  Body, 
  Plane,
  Vec3
} from 'cannon';
import SceneObject from './SceneObject';

export default class Ground extends SceneObject {

  constructor(scene, texture, scale=1000){
    if(texture){
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( 30, 30 );
    }
    let material = new THREE.MeshPhongMaterial({ map: texture });
    let mesh = new THREE.Mesh(new THREE.PlaneGeometry(scale, scale), material);
    mesh.rotation.x = -Math.PI/2;
    mesh.material.shininess = 0;
    mesh.castShadow = false;

    super(scene, 0,0,0, mesh);
    if(this.scene.physicsEnabled)
      this.initPhysics();
  }

  initPhysics(){
    this.body = new Body({ mass: 0 });
    let groundShape = new Plane();
    this.body.addShape(groundShape);
    this.body.quaternion.setFromAxisAngle(new Vec3(1,0,0),-Math.PI/2);
    this.body.position.set(0, 0, 0);
    this.scene.world.addBody(this.body);
  }

}
