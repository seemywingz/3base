'use-strict';

import * as tb from '../3base';

export default class ExampleScene extends tb.Scene {

    constructor(manager) {
        super(manager);// required
        this.load(); // required
    }

    createScene() {
        new tb.Sky(this, this.manager.loadTexture('assets/images/sky.jpg')).addToScene();
        new tb.Ground(this, this.manager.loadTexture('assets/images/ground.jpg')).addToScene();
        new tb.GLTFModel(this, 0, 0, -10, 'assets/models/deadpool', 3, 0, true)
            .then(deadpool => {
                deadpool.playAnimation(0);
            });
    }

    createLights() {
        let dl = new tb.DirectionalLight(this, 1, 200, 0);
        dl.addShadow(-30, 30, 30, -30);
        dl.addToScene();

        let skyColor = 0xe5efff;
        let groundColor = 0xecffd1;
        new tb.HemisphereLight(this, skyColor, groundColor, 0.02).addToScene();
    }
}
