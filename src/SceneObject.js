'use-strict';

import * as THREE from 'three';

export default class SceneObject {

  constructor(scene, x=0, y=0, z=0, threeObject=new THREE.Object3D()){
    this.x = x;
    this.y = y;
    this.z = z;
    this.body = null;
    this.mixer = null;
    this.scene = scene;
    this.threeObject = threeObject;
  }

  addToScene(){
    this.scene.scene.add(this.threeObject);
    this.scene.sceneObjects.push(this);
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

    if (this.helper) {
      this.helper.update()
    }

    this.onUpdate();
  }

  onUpdate(){}

  setPosition(x, y, z){
    this.threeObject.position.set(this.x = x, this.y = y, this.z = z);
  }
}
