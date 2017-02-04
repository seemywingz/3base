'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import  Promise from 'bluebird';
import {jsonLoader, objectLoader} from './LevelLoader';

THREE.Cache.enabled = true;

export default class SceneObject {

  constructor(level, x, y, z, textureSrc, geometry, model, scale=1, mass=1){
    this.x = x;
    this.y = y;
    this.z = z;
    this.scale = scale;
    this.mass = mass;
    this.model = model;
    this.dy = 0.1;
    this.level = level;
    this.mesh = null;
    this.body = null;
    this.geometry = geometry ? geometry : new THREE.PlaneGeometry(1,1);
    this.texture = textureSrc;

    if(model){
      this.loadModel();
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

  loadModel() {
    this.loadJSON(this.model, this.scale)
    .then(() => {
      // console.log("Model Loaded ");
      if(this.level.physics_enabled && this.mass >= 0){
        let cannonPoints = this.mesh.geometry.vertices.map(function(v) {
          return new CANNON.Vec3( v.x, v.y, v.z );
        });

        let cannonFaces = this.mesh.geometry.faces.map(function(f) {
            return [f.a, f.b, f.c];
        });

        var box = new THREE.Box3().setFromObject( this.mesh );
        this.mesh.geometry.computeBoundingBox();
        var boundingBox = this.mesh.geometry.boundingBox.clone();
        let size = box.getSize();
        // this.initPhysics(this.scale, this.mass, new CANNON.ConvexPolyhedron( cannonPoints, cannonFaces) );
        this.initPhysics(this.scale, this.mass, new CANNON.Box(new CANNON.Vec3(size.x*0.5, size.y, size.z*0.5)) );
      }
    });
  }

  loadOBJECT(model){
    objectLoader.load(
      './assets/models/' + model + '/' + model + '.json',
      ( obj ) => {
        this.level.scene.add(obj);
      }
    );
  }

  loadJSON(){
    return new Promise((resolve, reject) => {
      let material;
      jsonLoader.load(
        './assets/models/' + this.model + '/' + this.model + '.json',
        ( geometry, materials ) => {
          this.geometry = geometry;
          if(materials){
            if(materials.length > 1){
              // console.log("Multi Material Found");
              this.mesh = new THREE.Mesh( geometry, new THREE.MultiMaterial(materials));
            }else{
              // console.log("Single Material Found");
              material = new THREE.MeshPhongMaterial({
                map: materials[0].map,
                bumpMap: materials[0].bumpMap,
                bumpScale: materials[0].bumpScale,
                normalMap: materials[0].normalMap,
                specularMap: materials[0].specularMap,
                shininess: materials[0].shininess,
                side: THREE.DoubleSide
              });
              this.mesh = new THREE.Mesh( geometry, material);
           }
          }else {
             material = new THREE.MeshPhongMaterial({
               'shading': THREE.FlatShading
             });
             console.log("No Model Materials Found");
             this.mesh = new THREE.Mesh( geometry, material );
          }
          this.mesh.castShadow = true;
          this.mesh.receiveShadow = true;
          this.mesh.position.set(this.x, this.y, this.z);
          this.mesh.scale.set(this.scale, this.scale, this.scale);
          this.level.scene.add(this.mesh);
          // console.log("loaded model", this.mesh);
          resolve();
        },
        () => {},
        (e) => {reject(e);}
      );
    });
  }

  initPhysics(scale, mass, shape){
    return new Promise ((resolve, reject) => {
      try{
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
        this.level.animatedObjects.push(this);
        resolve();
      }catch (e) {
        reject(e);
      }
    });
  }

  animate(){
    if(this.level.physics_enabled ){
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
