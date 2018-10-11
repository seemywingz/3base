'use-strict';

import * as tb from '../3base';

export default class Scene1 extends tb.Scene {

  constructor(manager) {
    super(manager);
  }
  
  createScene(){
    this.enablePhysics();
    this.cannonBallTexture = this.manager.loadTexture( 'assets/images/ball.jpg');
    new tb.Sky(this, this.manager.loadTexture('assets/images/sky.jpg')).addToScene();
    new tb.Ground(this, this.manager.loadTexture( 'assets/images/ground.jpg')).addToScene();
    var ballTexture = this.manager.loadTexture( 'assets/images/beachBall.jpg');
    for (let index = 0; index < 30; index++) {
      let ball = new tb.Ball(this, tb.Utils.randNum(-50,50), tb.Utils.randNum(0.5, 200), tb.Utils.randNum(-50,50), ballTexture, 1, 0.05);
      ball.mesh.shinyness = 100;
      ball.addToScene();
    }

    new tb.GLTFModel(this, 0, 0, -10, 'assets/models/deadpool', 1.25, 0, true)
    .then(deadpool=>{
      deadpool.playAnimation(0);
    })
  }

  click(){
    let direction = this.camera.getDirection();
    let pos = this.camera.controls.position;

    let spd = 50;
    let ball = new tb.Ball(this, pos.x,pos.y,pos.z, this.cannonBallTexture, 0.51, 100);
    ball.body.angularVelocity.set(0, 0, 0);
    ball.body.velocity.set(direction.x * spd, direction.y * spd, direction.z * spd);
    ball.body.addEventListener("sleep",(event)=>{ball.die();});
    ball.addToScene();
  }
}
