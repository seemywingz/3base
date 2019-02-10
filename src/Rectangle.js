'use-strict';

import { 
  Mesh,
  BoxGeometry,
  MeshPhongMaterial
 } from 'three';
import MeshObject from './MeshObject';
import * as AMMO from 'ammo.js';

export default class Rectangle extends MeshObject {

  constructor(scene, x, y, z, w, h, d, texture, scale=1, mass=1){
    let material = new MeshPhongMaterial({ map: texture });
    let mesh = new Mesh(new BoxGeometry( w, h, d ), material);
    super(scene, x, y, z, mesh, scale, mass);
    if(this.scene.physicsEnabled)
      this.initPhysics(this.mass, new AMMO.btBoxShape(new AMMO.btVector3(w*0.5,h*0.5,d*0.5)) );
  }

}
