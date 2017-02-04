'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import {jsonLoader} from './LevelLoader';

THREE.Cache.enabled = true;

export default class SceneObject {

  constructor(level, x, y, z, textureSrc, geometry, model, scale=1){
    this.x = x;
    this.y = y;
    this.z = z;
    this.scale = scale;
    this.dy = 0.1;
    this.xrotation = 0;
    this.yrotation = 0;
    this.zrotation = 0;
    this.level = level;
    this.mesh = null;
    this.body = null;
    this.geometry = geometry ? geometry : new THREE.PlaneGeometry(1,1);
    this.texture = textureSrc;

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
      this.level.scene.add(this.mesh);
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
            console.log("Multi Material Found");
            this.mesh = new THREE.Mesh( geometry, new THREE.MultiMaterial(materials));
          }else{
            material = new THREE.MeshPhongMaterial({
              map: materials[0].map,
              bumpMap: materials[0].bumpMap,
              bumpScale: materials[0].bumpScale,
              normalMap: materials[0].normalMap,
              specularMap: materials[0].specularMap,
              shininess: materials[0].shininess
            });
            // console.log('Using Material', materials[0].clone());
            this.mesh = new THREE.Mesh( geometry, material);
         }
        }else {
           material = new THREE.MeshPhongMaterial({
             'shading': THREE.FlatShading
           });
           console.log("No Model Materials");
           this.mesh = new THREE.Mesh( geometry, material );
        }
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.scale.set(scale, scale, scale);
        this.level.scene.add(this.mesh);
      }
    );
  }

  initPhysics(scale, mass, shape){
    this.body = new CANNON.Body({
      mass: mass
    });
    this.body.addShape(shape);
    this.body.position.set(this.x,this.y,this.z);
    this.body.angularVelocity.set(0,0,0);
    this.body.angularDamping = 0.7;
    this.body.allowSleep = true;
    this.body.sleepSpeedLimit = 0.01; // Body will feel sleepy if speed < n (speed == norm of velocity)
    this.body.sleepTimeLimit = 0.5; // Body falls asleep after n seconds of sleepiness
    this.level.world.addBody(this.body);
  }

  animate(){
    if(this.level.physics_enabled){
      this.mesh.position.copy(this.body.position);
      this.mesh.quaternion.copy(this.body.quaternion);
    }
  }

  setPosition(x, y, z){
    this.mesh.position.set(this.x = x, this.y = y, this.z = z);
  }

  die(){
    this.level.scene.remove(this.mesh);
    if(this.level.physics_enabled){
      this.level.removeBodies.push(this.body);
    }
  }

}
