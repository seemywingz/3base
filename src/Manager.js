'use-strict';

import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
// import 'three-loaders/GLTFLoader';
THREE.Cache.enabled = true;

export default class Manager {
  constructor(rendererOptions, onLoad, onProgress) {

    this.manager
    this.glTFLoader
    this.textureLoader
    this.audioLoader

    this.initManager(onLoad, onProgress);
    this.initRenderer(rendererOptions);

    this.paused = false;

    // Window Event Listeners
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    window.addEventListener( 'blur', this.pause.bind(this));
    window.addEventListener( 'focus', this.unPause.bind(this));
    window.focus();
  }

  initManager(onLoad, onProgress){
    console.log("Loading...");
    this.manager = new THREE.LoadingManager();
    this.manager.onProgress = onProgress;

    this.manager.onLoad = () => {// Completion
      console.log("...Loaded");
      if (onLoad !== undefined){onLoad()};
      document.body.appendChild( this.renderer.domElement );
    };

    this.manager.onError = function () {
      console.log('there has been an error');
    };

    this.glTFLoader = new GLTFLoader(this.manager);
    this.textureLoader = new THREE.TextureLoader(this.manager);
    this.audioLoader = new THREE.AudioLoader();
  }

  initRenderer(rendererOptions){
    rendererOptions = (rendererOptions === null) ? { alpha: true, antialias: true}:rendererOptions;
    this.renderer = new THREE.WebGLRenderer(rendererOptions);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.gammaOutput = true;
    this.renderer.gammaInput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    // this.renderer.shadowMapSoft = true;
    // this.renderer.shadowCameraNear = 0.01;
    // this.renderer.shadowCameraFar = 1000;
    // this.renderer.shadowCameraFov = 45;
    // this.renderer.shadowMapBias = 0.0001;
    // this.renderer.shadowMapDarkness = 0.02;
    // this.renderer.shadowMapWidth = 1024;
    // this.renderer.shadowMapHeight = 1024;
  }

  // loadingAnimation(){
  //   if(this.loading){
  //     console.log('loading animation started...');
  //     var num = ~~randNum(0, loadingMsgs.length - 1);
  //     document.getElementById('loadingScreen').innerHTML = loadingMsgs[num];
  //     setTimeout(this.loadingAnimation, 100);
  //   }
  // }

  clear(){
    let scene = this.currentScene.scene;
    scene.children.forEach(function(object){
      scene.remove(object);
    });
  }

  onWindowResize() {
    if (this.currentScene !== undefined){
      this.currentScene.camera.lens.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
      this.currentScene.camera.lens.updateProjectionMatrix();
    }
  }

  pause(){
    console.log("!!PAUSING");
    this.paused = true;
  }

  unPause(){
    console.log("UNPAUSING!!");
    this.paused = false;
    if (this.currentScene !== undefined){
      this.currentScene.unPause()
    }
  }

  loadTexture(textureFile){
    return this.textureLoader.load(textureFile)
  }

  loadScene(scene){
    this.currentScene = new scene(this);
  }

}
