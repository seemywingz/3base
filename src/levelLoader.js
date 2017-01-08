'use-strict'

import {Level1} from './levels/Level1';
import {Level2} from './levels/Level2';


export default class LevelLoader {
  constructor() {
    this.levels = [];
    this.loadLevels();
    this.levelIndex = 0;
    this.currentLevel = this.levels[this.levelIndex];
  }

  loadLevels(){
    this.levels.push(new Level1());
  }
}
