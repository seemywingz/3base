'use-strict';

import {
  Mesh,
  SphereGeometry,
  MeshPhongMaterial
} from 'three';
import {Sphere} from 'cannon';
import SceneObject from './SceneObject';

export default class Ball extends SceneObject {

  constructor(level, x, y, z, texture, scale=1, mass=1){
    let material = new MeshPhongMaterial({ map: texture });
    let mesh = new Mesh(new SphereGeometry( scale, 32, 32 ), material);
    super(level, x, y, z, mesh, scale, mass);
    if(this.level.physicsEnabled)
      this.initPhysics(this.scale, this.mass, new Sphere(scale) );
  }

}
