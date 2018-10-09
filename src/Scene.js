'use-strict';

import Camera from './Camera';
import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class Scene {

  constructor(manager) {
    this.loading = false;
    this.manager = manager;
    this.removeBodies = [];
    this.sceneObjects = [];
    this.physicsEnabled = false;
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.camera = new Camera(0,2,0, this);
    this.load();
  }

  animate() {
    this.animationRequest = requestAnimationFrame( this.animate.bind(this) );
    if(document.hasFocus() && !this.manager.paused){
      this.camera.update();

      let deltaTime = this.clock.getDelta();

      if(this.physicsEnabled ){
        this.world.step(this.fixedTime, deltaTime, 5);
        this.lastTime = time;
        this.removeBodies.map((body)=>{
          this.world.remove(body);
        });
      }
      
      this.sceneObjects.map((sceneObject)=>{
        sceneObject.animate(deltaTime);
      });
      
      this.manager.renderer.render( this.scene, this.camera.lens );
    }
  }

  enablePhysics(){
    if(!this.physicsEnabled){
      this.physicsEnabled = true;
      this.world = new CANNON.World();
      this.world.gravity.set(0,-9.82,0);
      // this.world.broadphase = new CANNON.NaiveBroadphase();
      this.world.solver.iterations = 10;
      this.world.allowSleep = true;
      console.log("Scene Physics Enabled")
    }
  }

  load(){
    this.createLights();
    this.createScene();
    this.animate();
  }

  loadTexture(textureFile){
    return this.manager.textureLoader.load(textureFile)
  }

  createLights(){
    let light = new THREE.PointLight( 0xc9c9c9, 1, 50000, -1);
    light.position.set(0, 400, 100);
    light.castShadow = true;
    // light.shadowMapBias = 0.01;
    // light.shadowMapDarkness = 0.00001;
    // light.shadow.mapSize.width = 1024;
    // light.shadow.mapSize.height = 1024;
    this.scene.add( light );

    let pointLightHelper = new THREE.PointLightHelper( light, 20 );
    this.scene.add( pointLightHelper );

    // this.scene.add(new AmbientLight(0x9b9b9b, 0.2));

    let skyColor = 0xe5efff;
    let groundColor = 0xecffd1;
    light = new THREE.HemisphereLight( skyColor, groundColor, 0.2 );
    this.scene.add( light );
  }

  click(){
    console.log("Level CLICK!")
  }

  unPause(){
    
  }

  die(){
    this.camera.removeEventListeners();
    window.cancelAnimationFrame(this.animationRequest);
  }

  getAudio(fileName = "", volume = 1){
    let audio = new Audio(fileName);
    audio.volume = volume;
    return audio;
  }

  getPositionalAudio(fileName = "", dist = 1){
    let listener = new THREE.AudioListener();
    this.camera.lens.add( listener );  
    let audio = new THREE.PositionalAudio( listener );
    this.manager.audioLoader.load( fileName, function( buffer ) {
    	audio.setBuffer( buffer );
      audio.setRefDistance( dist );
    	audio.play();
    });
    return audio;
  }

  createScene(){}
}
