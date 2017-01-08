'use-strict'

import {Level1} from './levels/Level1';


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
