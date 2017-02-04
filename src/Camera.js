'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import {loadControls} from './THREE_Controls';

export default class Camera {

  constructor(level, x=0, y=200, z=10){
    this.x = x;
    this.y = y;
    this.z = z;
    this.height = 2;
    this.level = level;
    this.lastTouch = 9999;
    this.speed = 20;
    this.dy = 0;
    this.near = 0.1;
    this.far = 20000;
    this.body = null;
    this.jumpVelocity = 7;
    this.jumping = false;
    this.canJump = true;
    this.contactNormal = new CANNON.Vec3();
    this.upAxis = new CANNON.Vec3(0,1,0);
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      this.near,
      this.far
    );

    loadControls();
    this.controls = new THREE.PointerLockControls(this.camera);
    this.controls.lookSpeed = 0.02;
    this.controls.movementSpeed = this.speed;
    // this.controls.lon = -90;
    this.controls.getObject().position.set(this.x, this.y, this.z);
    this.level.scene.add(this.controls.getObject());

    this.addEventListeners();
    this.initPointerLock();
    this.initPhysics(1, 10, new CANNON.Cylinder(1, 1, this.height, 32));

    // this.raycaster = new THREE.Raycaster(); // create once and reuse

    // Easter Eggs
    this.konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    this.konamiIndex = 0;
    this.allowLook = true;
  }

  animate() {
    // this.body.wakeUp();
    if(this.controls.enabled){
      if (this.moveForward && !this.jumping){
        this.move('forward', this.speed);
      }

      if (this.moveBackward && !this.jumping){
        this.move('backward', this.speed);
      }

      if (this.moveLeft){
        this.move('left', this.speed*0.5);
      }

      if (this.moveRight){
        this.move('right', this.speed*0.5);
      }

      if (this.jumping && !this.canJump){
        this.canJump = true;
        this.body.velocity.set(this.body.velocity.x, this.jumpVelocity, this.body.velocity.z);
      }

    }
    // console.log(this.body.position);
    this.controls.getObject().position.copy(this.body.position);
    this.controls.getObject().position.y += this.height;
  }

  move(direction, speed){
    var localForward;
    switch (direction) {
      case 'forward':
        direction = new THREE.Vector3(0,0,-1);
        break;
      case 'backward':
        direction = new THREE.Vector3(0,0,1);
        break;
      case 'left':
        direction = new THREE.Vector3(-1,0,0);
        break;
      case 'right':
        direction = new THREE.Vector3(1,0,0);
        break;
      default:

    }
    let newDirection = new THREE.Vector3();
    this.controls.getDirection( newDirection , direction);
    this.body.velocity.set(newDirection.x * speed, this.body.velocity.y, newDirection.z * speed);
    // let v = this.body.velocity.vadd(new CANNON.Vec3(newDirection.x * speed, 0, newDirection.z * speed));
    // let n = 200;
    // v.x = this.clamp(v.x,-n,n);
    // v.z = this.clamp(v.z,-n,n);
    // this.body.velocity = v;
  }

  clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }

  initPhysics(scale, mass, shape){
    this.body = new CANNON.Body({
      mass: mass
    });
    this.body.addShape(shape);
    this.body.position.set(this.x,this.y,this.z);
    this.body.angularDamping = 1;
    // this.body.linearDamping = 0.9;
    this.body.fixedRotation = true;
    this.body.allowSleep = false;
    this.body.addEventListener("collide",function(e){
      let contact = e.contact;
      // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
      // We do not yet know which one is which! Let's check.
      if(contact.bi.id == this.body.id)  // bi is the player body, flip the contact normal
          contact.ni.negate(this.contactNormal);
      else
          this.contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is
      // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
      if(this.contactNormal.dot(this.upAxis) > 0.5){ // Use a "good" threshold value between 0 and 1 here!
        this.canJump = true;
        this.jumping = false;
      }
    }.bind(this));

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
      this.level.click();
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
        // if(!event.shiftKey){
        //   this.dy = this.speed;
        // }else{
        //   this.dy = -this.speed;
        // }
        if ( !this.jumping && this.canJump ){
          this.jumping = true;
          this.canJump = false;
        }
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
