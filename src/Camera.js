'use-strict';


import * as THREE from 'three';
import SceneObject from './SceneObject';

export default class Camera extends SceneObject{

  constructor(scene,x=0, y=0, z=0){
    super(scene, x, y, z)
    this.near = 0.5;
    this.speed = 400;
    this.far = 1000000;
    this.controls = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveForward = false;
    this.moveBackward = false;
    this.clock = new THREE.Clock();
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.lens = new THREE.PerspectiveCamera(
      45,
      this.scene.manager.renderer.domElement.width / this.scene.manager.renderer.domElement.height,
      this.near,
      this.far
    );
    this.lens.position.set(x, y, z);
	  this.lens.rotation.set( 0, 0, 0 );
  
    // Easter Eggs
    this.konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    this.konamiIndex = 0;
  }

  setPosition(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    if (this.controls) {
      this.controls.position.x = x;
      this.controls.position.y = y;
      this.controls.position.z = z;
    }
  }

  update(deltaTime){
    if(this.controls){
      
      this.velocity.x -= this.velocity.x * 10 * deltaTime;
      this.velocity.z -= this.velocity.z * 10 * deltaTime;
      // this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      if(this.moveUp){
        this.controls.position.y += 0.2;
      }
      if(this.moveDown){
        this.controls.position.y -= 0.2;
      }
      
      this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
			this.direction.x = Number( this.moveLeft ) - Number( this.moveRight );
      this.direction.normalize(); // this ensures consistent movements in all direction
      
			if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * this.speed * deltaTime;
			if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * (this.speed * 0.5) * deltaTime;
      
      this.controls.translateX( this.velocity.x * deltaTime );
			// this.controls.translateY( this.velocity.y * delta );
			this.controls.translateZ( this.velocity.z * deltaTime );
    }
  }

  enablePointerLockControls(){
    this.controls = this.pointerLockControls();
    this.initPointerLock();
    this.addEventListeners();
  }

  initPointerLock() {
    this.pointerLockElement = document.body;
    let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if(havePointerLock){
      this.pointerLockElement.requestPointerLock = this.pointerLockElement.requestPointerLock || this.pointerLockElement.mozRequestPointerLock || this.pointerLockElement.webkitRequestPointerLock;
      // this.pointerLockElement.requestPointerLock();
    }else{
      alert('Your Browser Does not Support Pointer Locking!');
    }
  }

  pointerLockControls(){
	  this.lens.rotation.set( 0, 0, 0 );
	  this.lens.position.set( 0, 0, 0 );

	  let pitchObject = new THREE.Object3D();
	  pitchObject.add( this.lens );
  
	  let yawObject = new THREE.Object3D();
	  yawObject.position.x = this.x;
	  yawObject.position.y = this.y;
	  yawObject.position.z = this.z;
	  yawObject.add( pitchObject );
    yawObject.enabled = false;
  
	  let PI_2 = Math.PI / 2;
  
	  let onMouseMove = function ( event ) {
      if(!yawObject.enabled) return;
	  	let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	  	let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
  
	  	yawObject.rotation.y -= movementX * 0.002;
	  	pitchObject.rotation.x -= movementY * 0.002;
  
	  	pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
    }
    document.addEventListener( 'mousemove', onMouseMove, false );
    this.scene.scene.add(yawObject);
    return yawObject;
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
      this.pointerLockElement.requestPointerLock();
      this.controls.enabled = true;
    }else{
      this.scene.click();
    }
  }

  getDirection (x=0, y=0, z=0) {
    let v = new THREE.Vector3();
    let direction = new THREE.Vector3( x, y, z );
    let rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
    rotation.set( this.controls.children[0].rotation.x, this.controls.rotation.y, 0 );
		v.copy( direction ).applyEuler( rotation );
		return v;
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
        this.moveDown = false;
        this.moveUp = false;
        break;
      case 27:/* escape */
        this.releasePointerLock();
        break;
    }
  }

  keyDown(event){
    this.shiftDown = event.shiftKey;
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
        if (this.shiftDown) {
          this.moveDown = true;
        }else{
          this.moveUp = true;
        }
        break;
    }
  }

  handleKonamiCode(keyCode){
    if(keyCode === this.konamiCode[this.konamiIndex]){
      this.konamiIndex += 1;
      if(this.konamiIndex === this.konamiCode.length){
        this.konamiIndex = 0;
        // alert('Konami Code of HONOR!');
        this.scene.extra();
      }
    }else{
      this.konamiIndex = 0;
    }
  }

}