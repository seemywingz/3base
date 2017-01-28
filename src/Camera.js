'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import {loadControls} from './THREE_Controls';

export default class Camera {

  constructor(level, x=0, y=200, z=0){
    this.x = x;
    this.y = y;
    this.z = z;
    this.height = 6;
    this.level = level;
    this.lastTouch = 9999;
    this.speed = 2;
    this.dy = 0;
    this.near = 0.1;
    this.far = 20000;
    this.body = null;
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      this.near,
      this.far
    );

    loadControls();
    this.initPhysics(1, 10, new CANNON.Cylinder(1, 1, this.height, 32));
    this.controls = new THREE.PointerLockControls(this.camera, this.body);
    this.controls.lookSpeed = 0.02;
    this.controls.movementSpeed = this.speed;
    // this.controls.lon = -90;
    this.controls.getObject().position.set(this.x, this.y, this.z);
    this.level.scene.add(this.controls.getObject());

    this.addEventListeners();
    this.initPointerLock();

    // this.raycaster = new THREE.Raycaster(); // create once and reuse

    // Easter Eggs
    this.konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    this.konamiIndex = 0;
    this.allowLook = true;
  }

  animate() {
    let velocity = new THREE.Vector3();

    if (this.moveForward){
      velocity = this.getDirection(new THREE.Vector3(0, 0, -this.speed));
      // this.controls.getObject().translateZ(velocity.z);
      this.body.velocity.z = velocity.z;
    }

    if (this.moveBackward){
      velocity = this.getDirection(new THREE.Vector3(0, 0, this.speed));
      this.controls.getObject().translateZ(velocity.z);
    }

    if (this.moveLeft){
       velocity = this.getDirection(new THREE.Vector3(-this.speed, 0, 0));
      // this.controls.getObject().translateX(velocity.x);
      // this.body.velocity = new CANNON.Vec3(velocity.x, velocity.y, velocity.z);
    }

    if (this.moveRight){
      velocity = this.getDirection(new THREE.Vector3(this.speed, 0, 0));
      this.controls.getObject().translateX(velocity.x);
    }

    if (this.jumping){
      velocity = this.getDirection(new THREE.Vector3(0, this.dy, 0));
      this.controls.getObject().translateY(velocity.y);
    }

    // console.log(this.body.position);
    this.controls.getObject().position.copy(this.body.position);
    this.controls.getObject().position.y += this.height;
  }

  initPhysics(scale, mass, shape){
    this.body = new CANNON.Body({
      mass: mass
    });
    this.body.addShape(shape);
    this.body.position.set(this.x,this.y,this.z);
    this.body.angularVelocity.set(0,0,0);
    this.body.angularDamping = 0.7;
    // this.body.allowSleep = true;
    // this.body.sleepSpeedLimit = 0.01; // Body will feel sleepy if speed < n (speed == norm of velocity)
    // this.body.sleepTimeLimit = 0.5; // Body falls asleep after n seconds of sleepiness
    this.level.world.addBody(this.body);
  }

  getDirection(angle){
    let matrix = new THREE.Matrix4();
    matrix.extractRotation( this.camera.matrix );
    return angle.applyMatrix4(matrix);
  }

  click(event){
    if(!this.controls.enabled && this.pointerLockElement){
      this.pointerLockElement.requestPointerLock();
      this.controls.enabled = true;
    }else{
      // console.log(this);
      this.level.click(this);
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
      case 70:/* f */
        this.level.extra();
        break;
      case 71:/* g */
        this.level.next();
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
        this.level.next();
        // levelLoader.currentLevel.extra();
      }
    }else{
      this.konamiIndex = 0;
    }
  }

  addEventListeners(){
    window.addEventListener( 'keyup', this.keyUp.bind(this), false);
    window.addEventListener( 'keydown', this.keyDown.bind(this), false);
    window.addEventListener( 'click', this.click.bind(this), false);
  }

  removeEventListeners(){
    window.removeEventListener( 'keyup', this.keyUp, false);
    window.removeEventListener( 'keydown', this.keyDown, false);
    window.removeEventListener( 'click', this.click, false);
    document.removeEventListener('pointerlockchange', this.pointerlockchange.bind(this), false);
    document.removeEventListener('mozpointerlockchange', this.pointerlockchange.bind(this), false);
    document.removeEventListener('webkitpointerlockchange', this.pointerlockchange.bind(this), false);
  }

  initPointerLock() {
    this.pointerLockElement = document.body;
    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', this.pointerlockchange.bind(this), false);
    document.addEventListener('mozpointerlockchange', this.pointerlockchange.bind(this), false);
    document.addEventListener('webkitpointerlockchange', this.pointerlockchange.bind(this), false);

    let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if(havePointerLock){
      this.pointerLockElement.requestPointerLock = this.pointerLockElement.requestPointerLock || this.pointerLockElement.mozRequestPointerLock || this.pointerLockElement.webkitRequestPointerLock;
    }else{
      alert('Your Browser Does not Support Pointer Locking!');
    }

    // Ask the browser to release the pointer
    // document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
    // document.exitPointerLock();
  }

  pointerlockchange() {
      if (document.pointerLockElement === this.pointerLockElement || document.mozPointerLockElement === this.pointerLockElement || document.webkitPointerLockElement === this.pointerLockElement) {
        this.controls.enabled = true;
        console.log('controls enabled');
        // document.getElementById('menu').style.display = 'none';
      } else {
        this.controls.enabled = false;
        console.log('controls disabled');
        // document.getElementById('menu').style.display = 'block';
      }
  }
}// Camera
