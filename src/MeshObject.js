'use-strict';

// import * as THREE from 'three';
import * as AMMO from 'ammo.js';
import SceneObject from './SceneObject';

export default class MeshObject extends SceneObject {

  constructor(scene, x=0, y=0, z=0, mesh, scale=1, mass=0){
    super(scene, x, y, z, mesh)
    this.mass = mass;
    this.body = null;
    this.mixer = null;
    this.scale = scale;
    this.mesh = this.threeObject;
    this.configMesh();
  }

  configMesh(){
    if (this.mesh === null) { return }
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.scale.set(this.scale, this.scale, this.scale);
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
      this.mesh.position.x = origin.x();
      this.mesh.position.y = origin.y();
      this.mesh.position.z = origin.z();
      var rotation = this.transform.getRotation();
      this.mesh.quaternion.x = rotation.x();
      this.mesh.quaternion.y = rotation.y();
      this.mesh.quaternion.z = rotation.z();
      this.mesh.quaternion.w = rotation.w();
    }

    if( this.mixer !== null)
      this.mixer.update( tick );

    this.onUpdate();
  }

  onUpdate(){}

  addPositionalAudio(fileName = "", dist = 1){
    let audio = this.scene.getPositionalAudio(fileName, dist)
    this.mesh.add(audio);
  }

  die(){
    this.scene.scene.remove(this.mesh);
    this.scene.removeBodies.push(this.body);
    this.scene.world.removeBody(this.body)
  }

}
