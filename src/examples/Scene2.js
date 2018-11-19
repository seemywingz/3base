'use-strict';

import * as tb from '../3base';

export default class Scene1 extends tb.Scene {

  constructor(manager) {
    super(manager);
    this.enablePhysics();
    this.camera.setPosition(0,4,3)
    this.camera.enablePointerLockControls();
    this.load(); 
  }
  
  createScene(){
    // this.cannonBallTexture = this.manager.loadTexture( 'assets/images/ball.jpg');
    new tb.Sky(this, this.manager.loadTexture('assets/images/sky.jpg')).addToScene();
    new tb.Ground(this, this.manager.loadTexture( 'assets/images/ground.jpg')).addToScene();
    
    var ballTexture = this.manager.loadTexture( 'assets/images/beachBall.jpg');
    let box = new tb.Box(this, 0,10,-10, ballTexture, 1, 0.05);
    box.addToScene();
    
    for (let index = 0; index < 50; index++) {
      let box = new tb.Box(this, tb.Utils.randNum(-5,5), tb.Utils.randNum(0.5, 200), tb.Utils.randNum(-5,5), ballTexture, 1, 0.05);
      box.mesh.shinyness = 100;
      box.addToScene();
    }

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
    let spd = 1;
    let pos = this.camera.controls.position;
    let direction = this.camera.getDirection();
    let ball = new tb.Ball(this, pos.x,pos.y,pos.z, this.cannonBallTexture, 1, 100);
    ball.body.velocity.set(direction.x * spd, direction.y * spd, direction.z * spd);
    ball.body.addEventListener("sleep",(event)=>{ball.die();});
    ball.body.angularVelocity.set(0, 0, 0);
    ball.addToScene();
  }
}