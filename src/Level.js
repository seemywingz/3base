'use-strict';

import Ball from './Ball';
import Box from './Box';
import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class Level {

  constructor(loader) {

    this.loader = loader;

    this.loading = false;
    this.removeBodies = [];
    this.animatedObjects = [];
    this.physics_enabled = true;

    this.lastTime = Date.now();
    this.fixedTime = 0.016;

    if(this.physics_enabled){
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
      this.camera.animate();

      if(this.physics_enabled ){
        let time = Date.now();
        let deltaTime = (time - this.lastTime);
        this.world.step(this.fixedTime, deltaTime + 5, 3);
        this.lastTime = time;
        this.removeBodies.map((body)=>{
          this.world.remove(body);
        });
      }

      this.animatedObjects.map((animatedObject)=>{
        animatedObject.animate();
      });

      this.loader.renderer.render( this.scene, this.camera.camera );
    }
  }

  load(){
    this.createLights();
    this.createScene();
    this.animate();
  }

  createLights(){
    let light = new THREE.PointLight( 0xc9c9c9, 1, 0, 3);
    light.position.set(0, 500, 100);
    light.castShadow = true;
    light.shadowMapBias = 0.01;
    light.shadowMapDarkness = 0.01;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add( light );

    // var pointLightHelper = new THREE.PointLightHelper( light, 2 );
    // scene.add( pointLightHelper );

    light = new THREE.HemisphereLight( 0xe8ffe9, 0x262626, 1 );
    this.scene.add( light );

    // light = new THREE.AmbientLight(0xd6d6d6);
    // light = new THREE.AmbientLight(0xffffff);
    // scene.add( light );
  }

  click(){
    let direction = new THREE.Vector3();
    this.camera.controls.getDirection( direction );
    let pos = this.camera.controls.getObject().position;

    let spd = 150;
    let velocity = this.camera.getDirection(new THREE.Vector3(direction.x * spd, direction.y * spd, direction.z * spd));

    let ball = new Ball(this,0, 0, 0, null, 1, 1000);
    ball.body.angularVelocity.set(0, 0, 0);
    ball.body.position.set(pos.x,pos.y,pos.z);
    ball.body.velocity.set(velocity.x, velocity.y, velocity.z);
    ball.body.addEventListener("sleep",(event)=>{
      ball.die();
    });
  }

  extra(){
    for (var i = 1; i < 10; i++) {
      new Box(this, randNum(-100,100), randNum(100,200), randNum(-100,-200), 'box/'+~~randNum(0,4)+'.jpg', ~~randNum(2,10));
    }
  }

  die(){
    this.camera.removeEventListeners();
    window.cancelAnimationFrame(this.animationRequest);
  }

  createScene(){}
}
