'use-strict';

import * as THREE from 'three';
import * as AMMO from 'ammo.js';
import MeshObject from './MeshObject';

export default class Ground extends MeshObject {

  constructor(scene, texture, scale=1000){
    if(texture){
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( 30, 30 );
    }
    let material = new THREE.MeshPhongMaterial({ map: texture });
    let mesh = new THREE.Mesh(new THREE.PlaneGeometry(scale, scale), material);
    super(scene, 0,0,0, mesh);
    this.threeObject.material.shininess = 0;
    this.threeObject.rotation.x = -Math.PI/2;
    this.threeObject.castShadow = false;
    this.threeObject.receiveShadow = true;
    if(this.scene.physicsEnabled)
      this.initPhysics();
  }

  initPhysics(){
    let groundShape = new AMMO.btBoxShape(new AMMO.btVector3(5000, 1, 5000));
    this.transform = new AMMO.btTransform();
    this.transform.setIdentity();
    this.transform.setOrigin(new AMMO.btVector3(0, -1, 0));
    let mass = 0;
    let localInertia = new AMMO.btVector3(0, 0, 0);
    let motionState = new AMMO.btDefaultMotionState(this.transform);
    let rbInfo = new AMMO.btRigidBodyConstructionInfo(mass, motionState, groundShape, localInertia);
    this.body = new AMMO.btRigidBody(rbInfo);
    this.body.setFriction(10);
    this.body.setRestitution(1);
    this.scene.dynamicsWorld.addRigidBody(this.body);
  }

  update(){}

}
