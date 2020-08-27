'use-strict';

import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
THREE.Cache.enabled = true;

export default class Manager {
  constructor(options) {
    this.manager
    this.glTFLoader
    this.audioLoader
    this.textureLoader
    this.paused = false;

    this.initManager(options.onLoad, options.onProgress, options.onError);
    this.initRenderer(options.rendererOptions);

    // Window Event Listeners
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    window.addEventListener( 'blur', this.pause.bind(this));
    window.addEventListener( 'focus', this.unPause.bind(this));
    window.focus();
  }

  initManager(onLoad, onProgress, onError){
    console.log("Loading...");
    this.manager = new THREE.LoadingManager();
    this.manager.onProgress = onProgress;

    this.manager.onLoad = () => {// Completion
      if (onLoad !== undefined){onLoad()};
      document.body.appendChild( this.renderer.domElement );
      console.log("...Loaded");
    };

    this.manager.onError = onError

    this.glTFLoader = new GLTFLoader(this.manager);
    this.objLoader = new OBJLoader(this.manager);
    this.textureLoader = new THREE.TextureLoader(this.manager);
    this.audioLoader = new THREE.AudioLoader();
  }

  initRenderer(rendererOptions){
    rendererOptions = (rendererOptions === null) ? { alpha: true, antialias: true}:rendererOptions;
    this.renderer = new THREE.WebGLRenderer(rendererOptions);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;
    this.renderer.gammaInput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  onWindowResize() {
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.currentScene.camera.lens.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
    this.currentScene.camera.lens.updateProjectionMatrix();
  }

  clear(){
    let scene = this.currentScene.scene;
    scene.children.forEach(function(object){
      scene.remove(object);
    });
  }

  pause(){
    console.log("!!PAUSING");
    this.paused = true;
    if (this.currentScene !== undefined){
      this.currentScene.pause()
    }
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

  playAudio(file="", volume=1, loop=false){
    let audio = new Audio(file);
    audio.volume = volume;
    if (loop)
    audio.addEventListener('ended', () => {
      this.currentTime = 0;
      this.play();
    }, false);
    audio.play();
  }
}
