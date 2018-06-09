'use-strict';

import {
  Mesh,
  BackSide,
  SphereGeometry,
  MeshBasicMaterial
}from 'three';
import SceneObject from './SceneObject';

export default class Sky extends SceneObject {

  constructor(level, texture, scale=1000){
    let material = new MeshBasicMaterial({ map: texture });
    let mesh = new Mesh(new SphereGeometry( scale, 32, 32 ), material);
    mesh.material.side = BackSide;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    super(level, 0,0,0, mesh, scale, -1);
  }

}
