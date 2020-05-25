'use-strict';

import * as THREE from 'three';
import './GLTFLoader';
import './OBJLoader';
THREE.Cache.enabled = true;

export default class Manager {
    constructor(rendererOptions, onLoad, onProgress) {

        this.manager
        this.glTFLoader
        this.audioLoader
        this.textureLoader
        this.paused = false;

        this.initManager(onLoad, onProgress);
        this.initRenderer(rendererOptions);

        // Window Event Listeners
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        window.addEventListener('blur', this.pause.bind(this));
        window.addEventListener('focus', this.unPause.bind(this));
        window.focus();
    }

    initManager(onLoad, onProgress) {
        console.log("Loading...");
        this.manager = new THREE.LoadingManager();
        this.manager.onProgress = onProgress;

        this.manager.onLoad = () => {// Completion
            console.log("...Loaded");
            if (onLoad !== undefined) { onLoad() };
            document.body.appendChild(this.renderer.domElement);
        };

        this.manager.onError = function() {
            console.log('there has been an error');
        };

        // this.glTFLoader = new GLTFLoader(this.manager);
        this.glTFLoader = new THREE.GLTFLoader(this.manager);
        this.objLoader = new THREE.OBJLoader(this.manager);
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.audioLoader = new THREE.AudioLoader();
    }

    initRenderer(rendererOptions) {
        rendererOptions = (rendererOptions === null) ? { alpha: true, antialias: true } : rendererOptions;
        this.renderer = new THREE.WebGLRenderer(rendererOptions);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2.2;
        this.renderer.gammaInput = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.currentScene.camera.lens.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
        this.currentScene.camera.lens.updateProjectionMatrix();
    }

    clear() {
        let scene = this.currentScene.scene;
        scene.children.forEach(function(object) {
            scene.remove(object);
        });
    }

    pause() {
        console.log("!!PAUSING");
        this.paused = true;
        if (this.currentScene !== undefined) {
            this.currentScene.pause()
        }
    }

    unPause() {
        console.log("UNPAUSING!!");
        this.paused = false;
        if (this.currentScene !== undefined) {
            this.currentScene.unPause()
        }
    }

    loadTexture(textureFile) {
        return this.textureLoader.load(textureFile)
    }

    loadScene(scene) {
        this.currentScene = new scene(this);
    }

    playAudio(file = "", volume = 1, loop = false) {
        let audio = new Audio(file);
        audio.volume = volume;
        if (loop)
            audio.addEventListener('ended', () => {
                this.currentTime = 0;
                this.play();
            }, false);
        audio.play();
    }
}
