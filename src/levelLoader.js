'use-strict';

import * as CANNON from 'cannon';
import * as THREE from 'three';
import {Level1} from './levels/Level1';
import {Level2} from './levels/Level2';

export default class LevelLoader {
  constructor() {

    this.levels = [];
    this.loadLevels();
    this.levelIndex = 0;
    this.currentLevel = this.levels[this.levelIndex];
    this.currentLevel.load();

    // Window Event Listeners
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    window.addEventListener( 'blur', this.pause.bind(this));
    window.addEventListener( 'focus', this.upPause.bind(this));

    window.focus();

  }

  loadLevels(){
    this.levels.push(new Level1());
    this.levels.push(new Level2());
  }

  reset(){

    scene.children.forEach(function(object){
      scene.remove(object);
    });
  }

  onWindowResize() {
    this.currentLevel.camera.resize();
    this.currentLevel.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  pause(){
    console.log("!!PAUSING");
    this.currentLevel.physic_enabled = false;
  }

  upPause(){
    console.log("UNPAUSING!!");
    this.currentLevel.lastTime = new Date().getTime();
    this.currentLevel.physic_enabled = true;
  }

  changeLevel(levelNumber){

    this.currentLevel = this.levels[levelNumber];

  }
}
