'use-strict';

import Camera from './Camera';
import PointLight from './PointLight';
import AmbientLight from './AmbientLight';
import HemisphereLight from './HemisphereLight';
import DirectionalLight from './DirectionalLight';
import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class Scene {

  constructor(manager) {
    this.loading = false;
    this.fixedTime = 0.015;
    this.manager = manager;
    this.removeBodies = [];
    this.sceneObjects = [];
    this.physicsEnabled = false;
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.camera = new Camera(this,0,2,0);
    this.load();
  }

  animate() {
    this.animationRequest = requestAnimationFrame( this.animate.bind(this) );
    if(document.hasFocus() && !this.manager.paused){
      
      let deltaTime = this.clock.getDelta();
      this.camera.update(deltaTime);
      
      if(this.physicsEnabled ){
        this.world.step(this.fixedTime, deltaTime, 5);
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

  createLights(){
    // new AmbientLight(this).addToScene();

    // let pl = new PointLight(this, 0,40,10);
    // pl.addHelper();
    // pl.addToScene();

    let dl = new DirectionalLight(this, 10, 10, 0);
    dl.addHelper();
    dl.addShadow(1000,1000);
    dl.addToScene()

    // let skyColor = 0xe5efff;
    // let groundColor = 0xecffd1;
    // new HemisphereLight(this, skyColor, groundColor, 0.02).addToScene();
  }

  click(){
    console.log("CLICK!")
  }

  unPause(){
    console.log("Scene Unpausing!")
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
