'use-strict';

import * as THREE from 'three';
import 'three-examples/loaders/GLTFLoader';
import Level1 from './levels/Level1';
import { randNum, loadingMsgs, fade } from './Utils';
THREE.Cache.enabled = true;


export let 
  manager,
  glTFLoader,
  textureLoader;

export default class LevelLoader {
  constructor() {

    this.initManager();
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

  initManager(){
    console.log("Loading...");
    manager = new THREE.LoadingManager();
    manager.onProgress = (/*item, loaded*/) => {
      if(!this.loading){
        this.loading = true;
        this.loadingAnimation();
      }
    };
    
    manager.onLoad = () => {// Completion
      console.log("...Loaded");
      this.loading = false;
      document.body.appendChild( this.renderer.domElement );
      fade( document.getElementById('overlay'));
    };

    manager.onError = function () {
      console.log('there has been an error');
    };

    glTFLoader = new THREE.GLTFLoader(manager);
    textureLoader = new THREE.TextureLoader(manager);
  }

  loadingAnimation(){
    if(this.loading){
      console.log('loading animation');
      var num = ~~randNum(0, loadingMsgs.length - 1);
      document.getElementById('overlay').innerHTML = loadingMsgs[num];
      setTimeout(this.loadingAnimation, 100);
    }
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
    this.renderer.shadowCameraNear = 0.01;
    this.renderer.shadowCameraFar = 1000;
    this.renderer.shadowCameraFov = 45;
    this.renderer.shadowMapBias = 0.0001;
    this.renderer.shadowMapDarkness = 0.02;
    this.renderer.shadowMapWidth = 1024;
    this.renderer.shadowMapHeight = 1024;
    this.renderer.gammaOutput = true;
    this.renderer.gammaInput = true;
  }

  onWindowResize() {
    this.currentLevel.camera.lens.aspect = window.innerWidth / window.innerHeight;
		this.currentLevel.camera.lens.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  pause(){
    console.log("!!PAUSING");
    this.paused = true;
  }

  unPause(){
    console.log("UNPAUSING!!");
    this.paused = false;
  }

  changeLevel(levelNumber){
    this.currentLevel = this.levels[levelNumber];
  }

}
