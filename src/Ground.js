'use-strict';

import {
  PlaneGeometry,
  RepeatWrapping,
} from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';

export default class Ground extends SceneObject {

  constructor(level, x, y, z, texture, scale=1){
    super(level, x, y, z, texture, new PlaneGeometry(scale, scale), null);

    if(texture){
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set( 30, 30 );
    }

    this.mesh.rotation.x = -Math.PI/2;
    this.mesh.material.shininess = 0;

    if(this.level.physicsEnabled)
      this.initPhysics(scale);
  }

  initPhysics(scale){
    this.body = new CANNON.Body({
        mass: 0 // mass == 0 makes the body static
    });
    let groundShape = new CANNON.Plane();
    this.body.addShape(groundShape);
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    this.body.position.set(0, 0, 0);
    this.level.world.addBody(this.body);
  }

}
