'use-strict';

import Camera from './Camera';
import * as THREE from 'three';
import * as AMMO from 'ammo.js';
import HemisphereLight from './HemisphereLight';
import DirectionalLight from './DirectionalLight';

export default class Scene {

    constructor(manager) {
        this.loading = false;
        this.fixedTime = 0.015;
        this.manager = manager;
        this.removeBodies = [];
        this.sceneObjects = [];
        this.physicsEnabled = false;
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.camera = new Camera(this, 0, 2, 0);
    }

    load() {
        this.createLights();
        this.createScene();
        this.update();
    }

    update() {
        this.animationRequest = requestAnimationFrame(this.update.bind(this));
        if (document.hasFocus() && !this.manager.paused) {

            let deltaTime = this.clock.getDelta();
            this.camera.update(deltaTime);

            if (this.physicsEnabled) {
                this.dynamicsWorld.stepSimulation(deltaTime, 1);
                // this.removeBodies.map((body)=>{
                //   this.world.remove(body);
                // });
            }

            this.sceneObjects.map((sceneObject) => {
                sceneObject.update(deltaTime);
            });

        }
        this.manager.renderer.render(this.scene, this.camera.lens);
    }

    enablePhysics() {
        this.physicsEnabled = true;
        let collisionConfiguration = new AMMO.btDefaultCollisionConfiguration();
        let dispatcher = new AMMO.btCollisionDispatcher(collisionConfiguration);
        let overlappingPairCache = new AMMO.btDbvtBroadphase();
        let solver = new AMMO.btSequentialImpulseConstraintSolver();
        this.dynamicsWorld = new AMMO.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        this.dynamicsWorld.setGravity(new AMMO.btVector3(0, -10, 0));
        console.log("Scene Physics Enabled");
    }

    createLights() {
        let dl = new DirectionalLight(this, 1, 200, 0);
        dl.addShadow();
        dl.addHelper();
        dl.addToScene();

        let skyColor = 0xe5efff;
        let groundColor = 0xecffd1;
        new HemisphereLight(this, skyColor, groundColor, 0.02).addToScene();
    }

    click() {
        console.log("CLICK!");
    }

    pause() {
        console.log("!Scene Paused")
    }

    unPause() {
        console.log("Scene Unpaused!");
    }

    die() {
        this.camera.removeEventListeners();
        window.cancelAnimationFrame(this.animationRequest);
    }

    getAudio(fileName = "", volume = 1) {
        let audio = new Audio(fileName);
        audio.volume = volume;
        return audio;
    }

    getPositionalAudio(fileName = "", dist = 1) {
        let listener = new THREE.AudioListener();
        this.camera.lens.add(listener);
        let audio = new THREE.PositionalAudio(listener);
        this.manager.audioLoader.load(fileName, function(buffer) {
            audio.setBuffer(buffer);
            audio.setRefDistance(dist);
            audio.play();
        });
        return audio;
    }

    createScene() { }
}
