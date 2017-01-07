'use-strict';

import Ball from './Ball';
import Box from './Box';
import * as THREE from 'three';
import {randNum} from './Utils';
import { scene, clock, animatedObjects, pointerLockElement } from './init';

export default class Camera {

  constructor(){
    this.x = navigator.hardwareConcurrency*2.1;
    this.y = 15;
    this.z = 0;
    this.lastTouch = 9999;
    this.speed = 1;
    this.dy = 0;
    this.near = 0.1;
    this.far = 10000;
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      this.near,
      this.far
    );
    this.camera.position.set(this.x, this.y, this.z);

    this.controls = new THREE.PointerLockControls(this.camera);
    this.controls.lookSpeed = 0.02;
    this.controls.movementSpeed = this.speed;
    // this.controls.lon = -90;
    this.controls.getObject().position.set(this.x, this.y, this.z);
    scene.add(this.controls.getObject());

    this.raycaster = new THREE.Raycaster(); // create once and reuse

    // Easter Eggs
    this.konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    this.konamiIndex = 0;
    this.allowLook = true;
  }

  animate() {
    // if(this.controls.enabled){
      var velocity = new THREE.Vector3();

      if (this.moveForward) velocity = this.getDirection(new THREE.Vector3(0, 0, -this.speed));
      if (this.moveBackward) velocity = this.getDirection(new THREE.Vector3(0, 0, this.speed));
      this.controls.getObject().translateZ(velocity.z);

      if (this.moveLeft) velocity = this.getDirection(new THREE.Vector3(-this.speed, 0, 0));
      if (this.moveRight) velocity = this.getDirection(new THREE.Vector3(this.speed, 0, 0));
      this.controls.getObject().translateX(velocity.x);

      if (this.jumping) velocity = this.getDirection(new THREE.Vector3(0, this.dy, 0));
      this.controls.getObject().translateY(velocity.y);
    // }
  }

  getDirection(angle){
    var matrix = new THREE.Matrix4();
    matrix.extractRotation( this.camera.matrix );
    return angle.applyMatrix4(matrix);
  }

  mouseScroll(event){
    // this.z = this.camera.position.z;
    // this.z -= (event.deltaY * this.speed);
    // this.camera.position.z = this.z;
  }

  mouseMove(event){

  }

  mouseDown(event){
    // this.controls.enabled = true;
  }

  mouseUp(event){
    // this.controls.enabled = false;
  }

  click(event){
    if(!this.controls.enabled && pointerLockElement){
      pointerLockElement.requestPointerLock();
      this.controls.enabled = true;
    }
  }

  keyUp(event){
    this.handleKonamiCode(event.keyCode);
    switch(event.keyCode){
      case 38: // up
      case 87: // w
        this.moveForward = false;
        break;
      case 37: // left
      case 65: // a
        this.moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        this.moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        this.moveRight = false;
        break;
      case 32: // space
          this.jumping = false;
        break;
      case 80:/* p */
        this.printPosition();
        break;
      case 27:/* escape */
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
        document.exitPointerLock();
        break;
    }
  }

  keyDown(event){
    switch(event.keyCode){
      case 38: // up
      case 87: // w
        this.moveForward = true;
        break;
      case 37: // left
      case 65: // a
        this.moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        this.moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        this.moveRight = true;
        break;
      case 32: // space
        if(!event.shiftKey){
          this.dy = this.speed;
        }else{
          this.dy = -this.speed;
        }
        this.jumping = true;
        break;
    }
  }

  touchScroll(event){
    var t = event.changedTouches[0];
    if(this.lastTouch === 9999){
      this.lastTouch = t.clientY;
      return;
    }else{
      var dy = this.lastTouch - t.clientY;
      this.lastTouch = t.clientY;
      this.z += dy * 0.01;
    }
  }

  touchEnd(){
    this.lastTouch = 9999;
  }

  resize(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  printPosition(){
    let pos = this.controls.getObject().position;
    let rot = this.controls.getObject().rotation;
    console.log('\nCamera:',
      '\n Position:\n',
      ' X: ' + pos.x + '\n',
      ' Y: ' + pos.y + '\n',
      ' Z: ' + pos.z + '\n',
      '\n Rotation:\n',
      ' X: ' + rot.x + '\n',
      ' Y: ' + rot.y + '\n',
      ' Z: ' + rot.z + '\n'
    );
  }

  handleKonamiCode(keyCode){
    if(keyCode === this.konamiCode[this.konamiIndex]){
      this.konamiIndex += 1;
      if(this.konamiIndex === this.konamiCode.length){
        this.konamiIndex = 0;
        alert('Konami Code of HONOR!');
        this.allowLook = !this.allowLook;
      }
    }else{
      this.konamiIndex = 0;
    }
  }

}// Camera
