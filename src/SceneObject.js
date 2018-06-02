'use-strict';

import * as THREE from 'three';
import  Promise from 'bluebird';
import {jsonLoader, objectLoader} from './LevelLoader';

THREE.Cache.enabled = true;

export default class SceneObject {

  constructor(level, x, y, z, texture, geometry, model, scale=1, animationSpeed=0.01){
    this.x = x;
    this.y = y;
    this.z = z;
    this.scale = scale;
    this.model = model;
    this.dy = 0.1;
    this.level = level;
    this.mesh = null;
    this.mixer = null;
    this.animationSpeed = animationSpeed;
    this.geometry = geometry ? geometry : new THREE.PlaneGeometry(1,1);
    this.texture = texture;

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
        this.initPhysics(this.scale, this.mass, new CANNON.Box(new CANNON.Vec3(size.x*0.5, size.y*0.5, size.z*0.5)) );
      }
    });
  }

  loadJSON(){
    return new Promise((resolve, reject) => {
      let material;
      jsonLoader.load(
        './assets/models/' + this.model + '/' + this.model + '.json',
        ( geometry, materials ) => {
          geometry.computeVertexNormals();
					geometry.computeMorphNormals();
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
                vertexColors: THREE.FaceColors,
                bumpScale: materials[0].bumpScale,
                normalMap: materials[0].normalMap,
                specularMap: materials[0].specularMap,
                shininess: materials[0].shininess,
                side: THREE.DoubleSide
              });
              this.mesh = new THREE.Mesh( geometry, material);
              if (!!this.geometry.animations){
                material.morphTargets = true;
                material.morphNormals = true;
                this.mixer = new THREE.AnimationMixer( this.mesh );
					      this.mixer.clipAction( geometry.animations[ 0 ] ).setDuration( 1 ).play();
              }

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

  animate(){
    if(this.level.physics_enabled ){
      this.mesh.position.copy(this.body.position);
      this.mesh.quaternion.copy(this.body.quaternion);
    }

    if( this.mixer !== null)
      this.mixer.update( this.animationSpeed );

    this.addAnimation();
  }

  addAnimation(){}

  setPosition(x, y, z){
    this.mesh.position.set(this.x = x, this.y = y, this.z = z);
  }

  die(){
    this.level.scene.remove(this.mesh);
  }

}
