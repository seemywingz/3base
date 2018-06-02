'use-strict';

import * as THREE from 'three';

export default class Level {

  constructor(loader) {
    this.loader = loader;
    this.loading = false;
  }

  animate() {
    this.animationRequest = requestAnimationFrame( this.animate.bind(this) );
    this.camera.update();
    this.loader.renderer.render( this.scene, this.camera.lens );
  }

  load(){
    this.createLights();
    this.createScene();
    this.animate();
  }

  createLights(){
    console.log("Let There Be Light!")
    let light = new THREE.PointLight( 0xc9c9c9, 1, 0, 3);
    light.position.set(0, 500, 100);
    light.castShadow = true;
    light.shadowMapBias = 0.01;
    light.shadowMapDarkness = 0.01;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add( light );

    // var pointLightHelper = new THREE.PointLightHelper( light, 2 );
    // this.scene.add( pointLightHelper );

    // light = new THREE.HemisphereLight( 0xe8ffe9, 0x262626, 1 );
    // this.scene.add( light );

    // light = new THREE.AmbientLight(0xd6d6d6);
    // light = new THREE.AmbientLight(0xffffff);
    // this.scene.add( light );
  }

  click(){
    console.log("CLICK!")
  }

  extra(){
    console.log("EXTRA!")
  }

  die(){
    this.camera.removeEventListeners();
    window.cancelAnimationFrame(this.animationRequest);
  }

  createScene(){}
}
