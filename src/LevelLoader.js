'use-strict';

import * as CANNON from 'cannon';
import * as THREE from 'three';
import Level1 from './levels/Level1';

export default class LevelLoader {
  constructor() {

    this.initRenderer();

    this.paused = false;

    // Window Event Listeners
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    window.addEventListener( 'blur', this.pause.bind(this));
    window.addEventListener( 'focus', this.unPause.bind(this));

    window.focus();

    this.currentLevel = new Level1(this);
    // this.currentLevel.load();
  }

  next(nextLevel){
    // this.clear();
    this.currentLevel = null;
    this.currentLevel = nextLevel;
    this.currentLevel.load();
  }

  clear(){
    let scene = this.currentLevel.scene;
    scene.children.forEach(function(object){
      scene.remove(object);
    });
  }

  initRenderer(){
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMapSoft = true;
    this.renderer.shadowCameraNear = 0.1;
    this.renderer.shadowCameraFar = 1000;
    this.renderer.shadowCameraFov = 45;
    this.renderer.shadowMapBias = 0.0001;
    this.renderer.shadowMapDarkness = 0.02;
    this.renderer.shadowMapWidth = 1024;
    this.renderer.shadowMapHeight = 1024;
  }

  onWindowResize() {
    this.currentLevel.camera.resize();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  pause(){
    console.log("!!PAUSING");
    this.paused = true;
  }

  unPause(){
    console.log("UNPAUSING!!");
    this.currentLevel.lastTime = new Date().getTime();
    this.paused = false;
  }

  changeLevel(levelNumber){

    this.currentLevel = this.levels[levelNumber];

  }
}
