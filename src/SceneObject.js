'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import {scene, world, physic_enabled} from './init';
import {textureLoader, jsonLoader} from './Utils';

THREE.Cache.enabled = true;

export default class SceneObject {

  constructor(x, y, z, textureSrc, geometry, model, scale=1){
    this.x = x;
    this.y = y;
    this.z = z;
    this.scale = scale;
    this.dy = 0.1;
    this.xrotation = 0;
    this.yrotation = 0;
    this.zrotation = 0;

    this.mesh = null;
    this.body = null;
    this.geometry = geometry ? geometry : new THREE.PlaneGeometry(1,1);
    this.texture = textureSrc ? textureLoader.load( 'assets/images/' + textureSrc) : null ;

    if(model){
      this.loadModel(model, scale);
    }else {
      var material = new THREE.MeshPhongMaterial({
        map: this.texture,
        transparent: true,
        shading: THREE.SmoothShading
      });
      this.mesh = new THREE.Mesh(this.geometry, material);
      this.mesh.customDepthMaterial = new THREE.ShaderMaterial();
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
      this.mesh.position.set(this.x, this.y, this.z);
      this.mesh.scale.set(this.scale, this.scale, this.scale);
      scene.add(this.mesh);
    }
  }

  loadModel(model, scale=1) {
    let material;
    jsonLoader.load(
      './assets/models/' + model + '/' + model + '.json',
      ( geometry, materials ) => {
        this.geometry = geometry;
        if(materials){
          console.log(materials);
          if(materials.length > 1){
            this.mesh = new THREE.Mesh( geometry, new THREE.MultiMaterial(materials));
          }else{
            material = new THREE.MeshPhongMaterial({
              map: materials[0].map,
              bumpMap: materials[0].bumpMap,
              bumpScale: materials[0].bumpScale,
              normalMap: materials[0].normalMap,
              specularMap: materials[0].specularMap,
              shininess: materials[0].shininess,
              side: THREE.DoubleSide
            });
            // console.log('Using Material', materials[0].clone());
            this.mesh = new THREE.Mesh( geometry, material);
         }
        }else {
           material = new THREE.MeshPhongMaterial({
             'shading': THREE.FlatShading
           });
           this.mesh = new THREE.Mesh( geometry, material );
        }

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.scale.set(scale, scale, scale);
        // console.log('Loaded:',this.mesh);
        scene.add(this.mesh);
      }
    );
  }

  initPhysics(){
  }

  animate(){
  }

  setPosition(x, y, z){
    this.mesh.position.set(this.x = x, this.y = y, this.z = z);
  }

}
