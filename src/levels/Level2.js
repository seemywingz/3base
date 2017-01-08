'use-strict'

import Sky from './Sky';
import Box from './Box';
import Ball from './Ball';
import * as THREE from 'three';
import Ground from './Ground';
import { scene, camera } from './init';
import { randNum } from './Utils';

class Level {

  constructor() {
    this.createLights();
    this.createScene();
  }

  createLights(){}
  createScene(){}
  extra(){}
  click(){}
}

export class Level1 extends Level {

  constructor() {
    super();
  }

  createLights(){
    let light = new THREE.PointLight( 0xc9c9c9, 1, 0, 3);
    light.position.set(0, 500, 100);
    light.castShadow = true;
    light.shadowMapBias = 0.01;
    light.shadowMapDarkness = 0.01;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add( light );

    // var pointLightHelper = new THREE.PointLightHelper( light, 2 );
    // scene.add( pointLightHelper );

    light = new THREE.HemisphereLight( 0xe8ffe9, 0x262626, 1 );
    scene.add( light );

    // light = new THREE.AmbientLight(0xd6d6d6);
    // light = new THREE.AmbientLight(0xffffff);
    // scene.add( light );
  }

  createScene(){

    new Sky(0, 800, 0, '/sky.jpg', 10000);
    new Ground(0, 0, 0, 'dry.jpg', 1000);

    let scale = 10,
        start = 5;
    for (let x = -start; x < start; x++) {
      for (var z = 0; z < 1; z++) {
        for (var y = 0; y < 20; y++) {
          let box = new Box((x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 10);
          box.body.sleep();
        }
      }
    }

    // scale = 1;
    // for (let x = 0; x < 2; x++) {
    //   for (let z = 0; z < 1; z++) {
    //     for (let y = 0; y < 20; y++) {
    //       let box = new Box(-20+(x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 1);
    //       box.body.sleep();
    //     }
    //   }
    // }
    //
    // scale = 1;
    // for (let x = 0; x < 2; x++) {
    //   for (let z = 0; z < 1; z++) {
    //     for (let y = 0; y < 20; y++) {
    //       let box = new Box(30+(x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 1);
    //       box.body.sleep();
    //     }
    //   }
    // }

    // var audio = new Audio('./assets/audio/wind.wav');
    // audio.play();
  }

  click(event){
    let getDirection = camera.getDirection;
    let direction = new THREE.Vector3();
    camera.controls.getDirection( direction );
    let pos = camera.controls.getObject().position;

    let spd = 300;
    let velocity = camera.getDirection(new THREE.Vector3(direction.x * spd, direction.y * spd, direction.z * spd));

    let ball = new Ball(0, 0, 0, null, 1, 10);
    ball.body.angularVelocity.set(0, 0, 0);
    ball.body.position.set(pos.x,pos.y,pos.z);
    ball.body.velocity.set(velocity.x, velocity.y, velocity.z);
    ball.body.addEventListener("sleep",(event)=>{
      ball.die();
    });
  }

  extra(){
    for (var i = 1; i < 10; i++) {
      new Box(randNum(-100,100), randNum(100,200), randNum(-100,-200), 'box/'+~~randNum(0,4)+'.jpg', ~~randNum(2,10));
    }
  }

}
