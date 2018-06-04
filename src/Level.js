'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class Level {

  constructor(loader) {
    this.loader = loader;
    this.loading = false;
    this.physicsEnabled = true;

    this.removeBodies = [];
    this.animatedObjects = [];

    this.lastTime = performance.now();
    this.fixedTime = 0.015;

    if(this.physicsEnabled){
      console.log("Level Physics Enabled")
      this.world = new CANNON.World();
      this.world.gravity.set(0,-9.82,0);
      this.world.broadphase = new CANNON.NaiveBroadphase();
      this.world.solver.iterations = 10;
      this.world.allowSleep = true;
    }
  }

  animate() {
    this.animationRequest = requestAnimationFrame( this.animate.bind(this) );
    if(document.hasFocus() && !this.loader.paused){
      this.camera.update();
      
      if(this.physicsEnabled ){
        let time = performance.now();
        let deltaTime = (time - this.lastTime);
        this.world.step(this.fixedTime, deltaTime, 5);
        this.lastTime = time;
        this.removeBodies.map((body)=>{
          this.world.remove(body);
        });
      }
      
      this.animatedObjects.map((animatedObject)=>{
        animatedObject.animate();
      });
      
      this.loader.renderer.render( this.scene, this.camera.lens );
    }
  }

  load(){
    this.createLights();
    this.createScene();
    this.animate();
  }

  createLights(){
    console.log("Let There Be Light!")
    let light = new THREE.PointLight( 0xc9c9c9, 1, 0, 3);
    light.position.set(0, 400, 100);
    light.castShadow = true;
    light.shadowMapBias = 0.01;
    light.shadowMapDarkness = 0.00001;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add( light );

    let pointLightHelper = new THREE.PointLightHelper( light, 2 );
    this.scene.add( pointLightHelper );

    let skyColor = 0xe5efff;
    let groundColor = 0xe2f9de;
    light = new THREE.HemisphereLight( skyColor, groundColor, 0.6 );
    this.scene.add( light );
  }

  click(){
    console.log("Level CLICK!")
  }

  extra(){
    console.log("Level EXTRA!")
  }

  die(){
    this.camera.removeEventListeners();
    window.cancelAnimationFrame(this.animationRequest);
  }

  createScene(){}
}
