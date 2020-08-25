'use-strict';

import * as tb from '../3base';
import Scene1 from './Scene1';
import ExampleScene from './ExampleScene';

// let manager = new tb.Manager({canvas: myCanvas});
let manager = new tb.Manager({"onLoad": ()=>{
    const loadingScreen = document.getElementById( 'loading-screen' );
    if ( loadingScreen != null){
      loadingScreen.classList.add( 'fade-out' );
    }
}});
manager.loadScene(Scene1);
