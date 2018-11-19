'use-strict';

import { 
  Mesh,
  BoxGeometry,
  MeshPhongMaterial
 } from 'three';
import MeshObject from './MeshObject';
import * as AMMO from 'ammo.js';

export default class Box extends MeshObject {

  constructor(scene, x, y, z, texture, scale=1, mass=1){
    let material = new MeshPhongMaterial({ map: texture });
    let mesh = new Mesh(new BoxGeometry( scale, scale, scale ), material);
    super(scene, x, y, z, mesh, scale, mass);
    if(this.scene.physicsEnabled)
      this.initPhysics(this.mass, new AMMO.btBoxShape(new AMMO.btVector3(scale*0.5,scale*0.5,scale*0.5)) );
  }

}
