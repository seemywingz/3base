'use-strict';

import { Mesh } from 'three';
import { Body } from 'cannon';
import Promise from 'bluebird';

export default class SceneObject {

  constructor(level, x=0, y=0, z=0, mesh=new Mesh(), scale=1, mass=0, animationSpeed=0.01){
    this.x = x;
    this.y = y;
    this.z = z;
    this.mass = mass;
    this.mesh = mesh;
    this.scale = scale;
    this.level = level;
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
    this.level.sceneObjects.push(this);
  }

  addToScene(){
    this.level.scene.add(this.mesh);
  }

  initPhysics(scale, mass, shape){
    if (!this.level.physicsEnabled) { return };
    new Promise ((resolve, reject) => {
      try{
        this.body = new Body({
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
        this.level.world.addBody(this.body);
        resolve();
      }catch (e) {
        reject(e);
      }
    });
  }

  animate(tick=0.5){
    if(this.level.physicsEnabled){
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
    this.level.scene.remove(this.mesh);
    this.level.removeBodies.push(this.body);
    // this.level.world.removeBody(this.body)
  }

}
