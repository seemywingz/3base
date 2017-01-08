'use-strict';

import Camera from './Camera';
import * as THREE from 'three';
import * as CANNON from 'cannon';
import LevelLoader from './LevelLoader';
import createScene from './assets/scenes/scene1.js';
import {
  mouseWheel,
  keyUp,
  keyDown,
  mouseMove,
  click,
  mouseDown,
  mouseUp,
  // touchMove,
  // touchEnd
} from './Utils';

export var
  scene,
  world,
  clock,
  camera,
  renderer,
  levelLoader,
  pointerLockElement,
  physic_enabled = true;

let
    lastTime = Date.now(),
    fixedTime = 0.016;

export let
  animatedObjects = [],
  removeBodies = [];

function animate() {
  requestAnimationFrame( animate );
  if(document.hasFocus()){
    camera.animate();

    if(physic_enabled){
      let time = Date.now();
      let deltaTime = (time - lastTime);
      world.step(fixedTime, deltaTime , 3);
      lastTime = time;
      removeBodies.map((body)=>{
        world.remove(body);
      });
    }

    animatedObjects.map((animatedObject)=>{
      animatedObject.animate();
    });

    renderer.render( scene, camera.camera );
  }
}

function pause(){
  console.log("PAUSING!!");
  physic_enabled=false;
}

function unpause(){
  console.log("!!UNPAUSING");
  lastTime = new Date().getTime();
  physic_enabled=true;
}

function onWindowResize() {
  camera.resize();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function initPointerLock() {
  pointerLockElement = document.body;
  // Hook pointer lock state change events
  document.addEventListener('pointerlockchange', pointerlockchange, false);
  document.addEventListener('mozpointerlockchange', pointerlockchange, false);
  document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

  var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
  if(havePointerLock){
    pointerLockElement.requestPointerLock = pointerLockElement.requestPointerLock || pointerLockElement.mozRequestPointerLock || pointerLockElement.webkitRequestPointerLock;
  }else{
    alert('Your Browser Does not Support Pointer Locking!');
  }

  // Ask the browser to release the pointer
  // document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
  // document.exitPointerLock();
}

function pointerlockchange() {
    if (document.pointerLockElement === pointerLockElement || document.mozPointerLockElement === pointerLockElement || document.webkitPointerLockElement === pointerLockElement) {
      camera.controls.enabled = true;
      console.log('controls enabled');
      // document.getElementById('menu').style.display = 'none';
    } else {
      camera.controls.enabled = false;
      console.log('controls disabled');
      // document.getElementById('menu').style.display = 'block';
    }
}

export function init() {

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowCameraNear = 0.1;
  renderer.shadowCameraFar = 1000;
  renderer.shadowCameraFov = 45;
  renderer.shadowMapBias = 0.0001;
  renderer.shadowMapDarkness = 0.02;
  renderer.shadowMapWidth = 1024;
  renderer.shadowMapHeight = 1024;

  if(physic_enabled){
    world = new CANNON.World();
    world.gravity.set(0,-9.82,0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    world.allowSleep = true;
  }

  // Event Listeners
  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'wheel', mouseWheel, false);
  window.addEventListener( 'keyup', keyUp, false);
  window.addEventListener( 'keydown', keyDown, false);
  window.addEventListener( 'click', click, false);
  // window.addEventListener( 'touchmove', touchMove, false );
  // window.addEventListener( 'touchend', touchEnd, false );
  //  window.addEventListener( 'mousemove', mouseMove, false);
  window.addEventListener( 'mouseup', mouseUp, false);
  window.addEventListener( 'mousedown', mouseDown, false);
  window.addEventListener( 'blur', pause);
  window.addEventListener( 'focus', unpause);

  window.focus();

  scene = new THREE.Scene();
  levelLoader = new LevelLoader();
  camera = new Camera();
  initPointerLock();
  animate();
}//..
