'use-strict';

import * as THREE from 'three';
import * as AMMO from 'ammo.js';
import SceneObject from './SceneObject';

export default class MeshObject extends SceneObject {

  constructor(scene, x=0, y=0, z=0, mesh, scale=1, mass=0){
    super(scene, x, y, z, mesh)
    this.mass = mass;
    this.body = null;
    this.mixer = null;
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

  addToScene(){
    super.addToScene();
    this.scene.sceneObjects.push(this);
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

  update(tick=0.5){
    if(this.scene.physicsEnabled && this.body !== null){
      this.body.getMotionState().getWorldTransform(this.transform);
      var origin = this.transform.getOrigin();
      this.threeObject.position.x = origin.x();
      this.threeObject.position.y = origin.y();
      this.threeObject.position.z = origin.z();
      var rotation = this.transform.getRotation();
      this.threeObject.quaternion.x = rotation.x();
      this.threeObject.quaternion.y = rotation.y();
      this.threeObject.quaternion.z = rotation.z();
      this.threeObject.quaternion.w = rotation.w();
    }

    if( this.mixer !== null)
      this.mixer.update( tick );

    this.onUpdate();
  }

  onUpdate(){}

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
