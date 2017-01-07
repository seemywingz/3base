'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';
import {world, animatedObjects, physic_enabled} from './init';

export default class Ground extends SceneObject {

  constructor(x, y, z, texturesrc, scale=1){
    super(x, y, z, texturesrc, new THREE.PlaneGeometry(scale, scale), null);

    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set( 20, 20 );

    this.mesh.rotation.x = -Math.PI/2;
    this.mesh.material.shininess = 0;

    if(physic_enabled)
      this.initPhysics(scale);
  }

  initPhysics(scale){
    // console.log(scale);
    this.body = new CANNON.Body({
        mass: 0 // mass == 0 makes the body static
    });
    let groundShape = new CANNON.Plane();
    this.body.addShape(groundShape);
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    this.body.position.set(0, 0, 0);
    world.addBody(this.body);
    animatedObjects.push(this);
  }

  animate(){
    // this.mesh.rotation.x = this.xrot+=0.01;
  }
}
