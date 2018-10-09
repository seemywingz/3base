'use-strict';

import * as tb from '../3base';
import Scene1 from './Scene1';

let loaders = new tb.Loaders(
  {canvas: myCanvas},
  ()=>{console.log("Progressing")}
);
loaders.loadScene(Scene1);