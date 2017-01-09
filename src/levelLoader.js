'use-strict'

import {Level1} from './levels/Level1';
import {Level2} from './levels/Level2';
import { reset } from './init';

export default class LevelLoader {
  constructor() {
    this.levels = [];
    this.loadLevels();
    this.levelIndex = 0;
    this.currentLevel = this.levels[this.levelIndex];
    this.currentLevel.load();
  }

  loadLevels(){
    this.levels.push(new Level1());
    this.levels.push(new Level2());
  }

  changeLevel(levelNumber){

    this.currentLevel = this.levels[levelNumber];

  }
}
