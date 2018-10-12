'use-strict';

import {
  Mesh,
  SphereGeometry,
  MeshPhongMaterial
} from 'three';
import {Sphere} from 'cannon';
import MeshObject from './MeshObject';

export default class Ball extends MeshObject {

  constructor(scene, x, y, z, texture, scale=1, mass=1){
    let material = new MeshPhongMaterial({ map: texture });
    let mesh = new Mesh(new SphereGeometry( scale, 32, 32 ), material);
    super(scene, x, y, z, mesh, scale, mass);
    if(this.scene.physicsEnabled)
      this.initPhysics(this.mass, new Sphere(scale) );
  }

}
