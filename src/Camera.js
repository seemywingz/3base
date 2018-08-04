'use-strict';

import {
  Euler,
  Vector3,
  Object3D,
  PerspectiveCamera 
} from 'three';

export default class Camera{

  constructor(x=0, y=0, z=0, level){
    this.level = level;
    this.x = x;
    this.y = y;
    this.z = z;
    this.height = y;
    this.speed = 400;
    this.velocity = new Vector3();
    this.direction = new Vector3();
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.near = 0.5;
    this.far = 1000000;

    this.lens = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      this.near,
      this.far
    );
    
    this.initPointerLock();
    this.addEventListeners();

    // Easter Eggs
    this.konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    this.konamiIndex = 0;
    this.pTime = performance.now();
  }

  update(){
    if(this.controls.enabled){
      let time = performance.now();
      let delta = ( time - this.pTime ) / 1000;
      
      this.velocity.x -= this.velocity.x * 10 * delta;
      this.velocity.z -= this.velocity.z * 10 * delta;
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
      
			if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * this.speed * delta;
			if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * (this.speed * 0.5) * delta;
      
      this.controls.translateX( this.velocity.x * delta );
			// this.controls.translateY( this.velocity.y * delta );
			this.controls.translateZ( this.velocity.z * delta );
      
      this.pTime = time;
    }
  }

  pointerLockControls(){
	  this.lens.rotation.set( 0, 0, 0 );

	  let pitchObject = new Object3D();
	  pitchObject.add( this.lens );
  
	  let yawObject = new Object3D();
	  yawObject.position.x = this.x;
	  yawObject.position.y = this.height;
	  yawObject.position.z = this.z;
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

  initPointerLock() {
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
      this.pointerLockElement.requestPointerLock();
      this.controls.enabled = true;
    }else{
      this.level.click();
    }
  }

  getDirection () {
    let v = new Vector3();
    let direction = new Vector3( 0, 0, -1 );
    let rotation = new Euler( 0, 0, 0, "YXZ" );
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
        this.level.extra();
      }
    }else{
      this.konamiIndex = 0;
    }
  }

}