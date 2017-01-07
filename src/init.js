'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import Camera from './Camera';
import {createScene} from './sceneCreation';
import {loadControls} from './THREE_Controls';
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
  pointerLockElement,
  physic_enabled = true;

let
    currentTime = new Date().getTime(),
    accumulator = 0,
    deltaTime = 0.008;

export let animatedObjects = [];

function animate() {
  requestAnimationFrame( animate );
  if(document.hasFocus()){
    camera.animate();

    if(physic_enabled)
      stepSimulation();

    animatedObjects.map(function(animatedObject){
      animatedObject.animate();
    });

    renderer.render( scene, camera.camera );
  }
}

function stepSimulation () {
  let newTime = new Date().getTime();
  let frameTime = (newTime - currentTime)/100;
  currentTime = newTime;
  world.step(deltaTime, frameTime, 10);
  // console.log(frameTime);
}

function pause(){
  console.log("PAUSING!!");
  physic_enabled=false;
}

function unpause(){
  console.log("!!UNPAUSING");
  currentTime = new Date().getTime();
  physic_enabled=true;
}

function onWindowResize() {
  camera.resize();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function initCannon() {
  world = new CANNON.World();
  world.gravity.set(0,-9.82,0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;

  // Create a plane
  var groundBody = new CANNON.Body({
      mass: 0 // mass == 0 makes the body static
  });
  var groundShape = new CANNON.Plane();
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
  groundBody.position.set(0, 0, 0);
  world.addBody(groundBody);
}

function initPointerLock(element) {
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
  loadControls();
  if(physic_enabled)
    initCannon();

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowCameraNear = 0.1;
  renderer.shadowCameraFar = 10000;
  renderer.shadowCameraFov = 45;
  renderer.shadowMapBias = 0.0001;
  renderer.shadowMapDarkness = 0.02;
  renderer.shadowMapWidth = 2048;
  renderer.shadowMapHeight = 2048;

  clock = new THREE.Clock();
  scene = new THREE.Scene();
  camera = new Camera();
  initPointerLock(pointerLockElement);

  // Event Listeners
  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'wheel', mouseWheel, false);
  window.addEventListener( 'keyup', keyUp, false);
  window.addEventListener( 'keydown', keyDown, false);
  window.addEventListener( 'click', click, false);
  // window.addEventListener( 'onblur', (e) => {clock.stop();}, false);
  // window.addEventListener( 'onfocus', (e) => {clock.start();}, false);
  // window.addEventListener( 'touchmove', touchMove, false );
  // window.addEventListener( 'touchend', touchEnd, false );
  //  window.addEventListener( 'mousemove', mouseMove, false);
  window.addEventListener( 'mouseup', mouseUp, false);
  window.addEventListener( 'mousedown', mouseDown, false);
  window.addEventListener("blur", pause);
  window.addEventListener("focus", unpause);

  window.focus();

  createScene();
  animate();
}//..
