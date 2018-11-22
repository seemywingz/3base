'use-strict';

import * as tb from '../3base';
export default class Scene1 extends tb.Scene {

  constructor(manager) {
    super(manager);
    this.enablePhysics();
    this.camera.setPosition(0,4,15)
    this.camera.enablePointerLockControls();
    this.load(); 
  }
  
  createScene(){
    this.cannonBallTexture = this.manager.loadTexture( 'assets/images/ball.jpg');
    new tb.Sky(this, this.manager.loadTexture('assets/images/sky.jpg')).addToScene();
    new tb.Ground(this, this.manager.loadTexture( 'assets/images/ground.jpg')).addToScene();
    
    let boxTextures = [];
    for (let i = 0; i < 5; i++) {
      boxTextures.push(this.manager.loadTexture( `assets/images/box/${i}.jpg`));
    }
    for (let w = 0; w < 5; w++) {
      for (let h = 0; h < 10; h++) {
        for (let d = 0; d < 5; d++) {
          let box = new tb.Box(this,w,h,d, boxTextures[~~tb.Utils.randNum(0,boxTextures.length-1)], 1, 2.5);
          // box.body.setActivationState(0);
          box.addToScene();
        }
      }
    }
    
    // let ballTexture = this.manager.loadTexture( 'assets/images/beachBall.jpg');
    // for (let index = 0; index < 25; index++) {
    //   let ball = new tb.Ball(this, tb.Utils.randNum(-10,5), tb.Utils.randNum(0.5, 200), tb.Utils.randNum(-10,5), ballTexture, 1, 0.05);
    //   ball.threeObject.shinyness = 100;
    //   ball.body.setFriction(10);
    //   ball.body.setRestitution(0.5);
    //   ball.body.setDamping(0.05, 0.05);
    //   ball.addToScene();
    // }
    
    // new tb.GLTFModel(this, -5, 0, -10, 'assets/models/deadpool', 3, 0)
    // .then(deadpool=>{
    //   deadpool.playAnimation(0);
    //   deadpool.addToScene();
    // })

    new tb.GLTFModel(this, -10, 0, -10, 'assets/models/radio', 1, 100)
    .then(model=>{
      // model.initPhysics(1, new tb.AMMO.btBoxShape(new tb.AMMO.btVector3(1,0.5,0.45)));
      // model.initConcavePhysics();
      model.initBoundingBoxPhysics();
      // model.setRotation(0,1,0,-1);
      console.log(model.model)
      // model.addPositionalAudio("./assets/audio/theme.ogg", 10);
      model.addToScene();
    })
     
    // this.manager.playAudio('./assets/audio/wind.wav', 0.5, true);
  }

  createLights(){
    let dl = new tb.DirectionalLight(this, 1, 200, 0);
    dl.addShadow(-30,30,30,-30);
    dl.addToScene()

    let skyColor = 0xe5efff;
    let groundColor = 0xecffd1;
    new tb.HemisphereLight(this, skyColor, groundColor, 0.02).addToScene();
  }

  click(){
    let spd = 50;
    let pos = this.camera.controls.position;
    let direction = this.camera.getDirection(0,0,-1);
    let ball = new tb.Ball(this, pos.x,pos.y,pos.z, this.cannonBallTexture, 0.25, 100);
    ball.body.setLinearVelocity(new tb.AMMO.btVector3(direction.x * spd, direction.y * spd, direction.z * spd));
    ball.addToScene();
  }
}
