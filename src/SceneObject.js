'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class SceneObject {

  constructor(scene, x=0, y=0, z=0, mesh=new THREE.Mesh(), scale=1, mass=0, animationSpeed=0.01){
    this.x = x;
    this.y = y;
    this.z = z;
    this.mass = mass;
    this.mesh = mesh;
    this.scale = scale;
    this.scene = scene;
    this.animationSpeed = animationSpeed;
    this.body = null;
    this.mixer = null;
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

  addToScene(){
    this.scene.scene.add(this.mesh);
  }

  initPhysics(scale, mass, shape){
    if (!this.scene.physicsEnabled) { return };
    new Promise ((resolve, reject) => {
      try{
        this.body = new CANNON.Body({
          mass: mass
        });
        // console.log("Init Physics");
        this.body.addShape(shape);
        this.body.position.set(this.x,this.y,this.z);
        this.body.angularVelocity.set(0,0,0);
        this.body.angularDamping = 0.7;
        this.body.allowSleep = true;
        this.body.sleepSpeedLimit = 0.01; // Body will feel sleepy if speed < n (speed == norm of velocity)
        this.body.sleepTimeLimit = 0.5; // Body falls asleep after n seconds of sleepiness
        this.scene.world.addBody(this.body);
        resolve();
      }catch (e) {
        reject(e);
      }
    });
  }

  animate(tick=0.5){
    if(this.scene.physicsEnabled){
      // console.log("anmimating object");
      if(this.body !== null){
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
      }
    }

    if( this.mixer !== null)
      this.mixer.update( tick );

    this.animation();
  }

  animation(){}

  setPosition(x, y, z){
    this.mesh.position.set(this.x = x, this.y = y, this.z = z);
  }

  die(){
    this.scene.scene.remove(this.mesh);
    this.scene.removeBodies.push(this.body);
    this.scene.world.removeBody(this.body)
  }

  addPositionalAudio(fileName = "", dist = 1){
    let audio = this.scene.getPositionalAudio(fileName, dist)
    this.mesh.add(audio);
  }

}
