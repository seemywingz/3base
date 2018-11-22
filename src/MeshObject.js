'use-strict';

import * as THREE from 'three';
import * as AMMO from 'ammo.js';
import SceneObject from './SceneObject';

export default class MeshObject extends SceneObject {

  constructor(scene, x=0, y=0, z=0, mesh, scale=1, mass=0){
    super(scene, x, y, z, mesh)
    this.mass = mass;
    this.scale = scale;
    this.configMesh();
  }

  configMesh(){
    if (this.threeObject === null) { return }
    this.threeObject.position.set(this.x, this.y, this.z);
    this.threeObject.castShadow = true;
    this.threeObject.side = THREE.DoubleSide;
    this.threeObject.receiveShadow = true;
  }

  initPhysics(mass, shape){
    this.transform = new AMMO.btTransform();
    this.transform.setIdentity();
    this.transform.setOrigin(new AMMO.btVector3(this.x, this.y,this.z));
    var localInertia = new AMMO.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    var motionState = new AMMO.btDefaultMotionState(this.transform);
    var rbInfo = new AMMO.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    this.body = new AMMO.btRigidBody(rbInfo);
    this.scene.dynamicsWorld.addRigidBody(this.body);
  }

  setRotation(x=0.0, y=0.0, z=0.0, w=0.0){
    let quat = new AMMO.btQuaternion(x,y,z,w);
    this.body.getCenterOfMassTransform(this.transform);
    this.transform.setRotation(quat);
    this.body.setCenterOfMassTransform(this.transform);
  }

  addPositionalAudio(fileName = "", dist = 1){
    let audio = this.scene.getPositionalAudio(fileName, dist)
    this.threeObject.add(audio);
  }

  die(){
    this.scene.scene.remove(this.threeObject);
    this.scene.removeBodies.push(this.body);
    // this.scene.world.removeBody(this.body)
  }

}
