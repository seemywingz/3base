'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';

export default class House extends SceneObject {

  constructor(level, x, y, z, model, scale=1, mass=1){
    super(level, x, y, z, null, null, model, scale);   
  }

}
