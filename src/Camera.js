'use-strict';

import * as THREE from 'three';
import Level from './Level';

export default class Camera{

  constructor(x=0, y=0, z=0, level){
    this.level = level;
    this.lens = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.5,
      100000
    );
    this.lens.position.x = x;
    this.lens.position.y = y;
    this.lens.position.z = z;
    
    this.initPointerLockControls();
    this.addEventListeners();

     // Easter Eggs
     this.konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
     this.konamiIndex = 0;
  }

  update(){
    // this.controls.translateZ(this.controls.z -= 0.010);
  }

  pointerLockControls(){
	  this.lens.rotation.set( 0, 0, 0 );

	  let pitchObject = new THREE.Object3D();
	  pitchObject.add( this.lens );
  
	  let yawObject = new THREE.Object3D();
	  yawObject.position.y = 10;
	  yawObject.add( pitchObject );
    yawObject.enabled = false;
  
	  let PI_2 = Math.PI / 2;
  
	  let onMouseMove = function ( event ) {
      // console.log("Mouse Moving");
      if(!yawObject.enabled) return;
	  	let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	  	let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
  
	  	yawObject.rotation.y -= movementX * 0.002;
	  	pitchObject.rotation.x -= movementY * 0.002;
  
	  	pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
    }
    document.addEventListener( 'mousemove', onMouseMove, false );
    this.level.scene.add(yawObject);
    return yawObject;
  }

  initPointerLockControls() {
    this.controls = this.pointerLockControls();
    this.pointerLockElement = document.body;
    let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if(havePointerLock){
      this.pointerLockElement.requestPointerLock = this.pointerLockElement.requestPointerLock || this.pointerLockElement.mozRequestPointerLock || this.pointerLockElement.webkitRequestPointerLock;
      // this.pointerLockElement.requestPointerLock();
    }else{
      alert('Your Browser Does not Support Pointer Locking!');
    }
  }

  pointerlockchange() {
      if (document.pointerLockElement === this.pointerLockElement || document.mozPointerLockElement === this.pointerLockElement || document.webkitPointerLockElement === this.pointerLockElement) {
        this.controls.enabled = true;
        console.log('Pointer Locked');
        // document.getElementById('menu').style.display = 'none';
      } else {
        this.controls.enabled = false;
        console.log('Pointer Released');
        // document.getElementById('menu').style.display = 'block';
      }
  }

  releasePointerLock(){
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
    document.exitPointerLock();
  }

  addEventListeners(){
    window.addEventListener( 'keyup', this.keyUp.bind(this), false);
    window.addEventListener( 'keydown', this.keyDown.bind(this), false);
    window.addEventListener( 'click', this.click.bind(this), false);
    document.addEventListener('pointerlockchange', this.pointerlockchange.bind(this), false);
    document.addEventListener('mozpointerlockchange', this.pointerlockchange.bind(this), false);
    document.addEventListener('webkitpointerlockchange', this.pointerlockchange.bind(this), false);
  }

  removeEventListeners(){
    window.removeEventListener( 'keyup', this.keyUp, false);
    window.removeEventListener( 'keydown', this.keyDown, false);
    window.removeEventListener( 'click', this.click, false);
    document.removeEventListener('pointerlockchange', this.pointerlockchange.bind(this), false);
    document.removeEventListener('mozpointerlockchange', this.pointerlockchange.bind(this), false);
    document.removeEventListener('webkitpointerlockchange', this.pointerlockchange.bind(this), false);
  }

  click(){
    if(!this.controls.enabled && this.pointerLockElement){
      // console.log("CLICK!")
      this.pointerLockElement.requestPointerLock();
      this.controls.enabled = true;
    }else{
      // console.log(this);
      // this.level.click();
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
        this.releasePointerLock();
        break;
    }
  }

  keyDown(event){
    this.running = event.shiftKey;
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
        if ( !this.jumping && this.standing ){
          this.jumping = true;
        }
        break;
    }
  }

  handleKonamiCode(keyCode){
    if(keyCode === this.konamiCode[this.konamiIndex]){
      this.konamiIndex += 1;
      if(this.konamiIndex === this.konamiCode.length){
        this.konamiIndex = 0;
        alert('Konami Code of HONOR!');
        // this.level.next();
        // levelLoader.currentLevel.extra();
      }
    }else{
      this.konamiIndex = 0;
    }
  }

}