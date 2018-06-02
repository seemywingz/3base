'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';

export default class Ground extends SceneObject {

  constructor(level, x, y, z, texturesrc, scale=1){
    super(level, x, y, z, texturesrc, new THREE.PlaneGeometry(scale, scale), null);

    if(this.texture){
      this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
      this.texture.repeat.set( 30, 30 );
    }

    this.mesh.rotation.x = -Math.PI/2;
    this.mesh.material.shininess = 0;

    if(this.level.physicsEnabled)
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
    this.level.world.addBody(this.body);
    this.level.animatedObjects.push(this);
  }

  animate(){
    // this.mesh.rotation.x = this.xrot+=0.01;
  }
}
