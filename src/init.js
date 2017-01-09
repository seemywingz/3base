'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import LevelLoader from './LevelLoader';

export var
  scene,
  world,
  renderer,
  levelLoader,
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
    levelLoader.currentLevel.camera.animate();

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

    renderer.render( scene, levelLoader.currentLevel.camera.camera );
  }
}

function pause(){
  console.log("PAUSING!!");
  physic_enabled=false;
}

function upPause(){
  console.log("!!UNPAUSING");
  lastTime = new Date().getTime();
  physic_enabled=true;
}

function onWindowResize() {
  levelLoader.currentLevel.camera.resize();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

export function reset(){

  scene.children.forEach(function(object){
    scene.remove(object);
  });
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

  // Window Event Listeners
  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'blur', pause);
  window.addEventListener( 'focus', upPause);

  window.focus();

  scene = new THREE.Scene();
  levelLoader = new LevelLoader();
  animate();
}//..
