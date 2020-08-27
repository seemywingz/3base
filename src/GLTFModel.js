'use-strict';

import * as THREE from 'three';
import * as AMMO from 'ammo.js';
import MeshObject from './MeshObject';

export default class GLTFModel extends MeshObject {

  constructor(scene, x, y, z, model, scale=1, mass=1){
    super(scene, x, y, z, null, scale, mass);
    this.model = model;
    return this.loadGLTF()
  }

  loadGLTF(){
    return new Promise((resolve, reject) => {
      this.scene.manager.glTFLoader.load(
        this.model + '/scene.gltf',
        ( gltf ) => {
          try{
            this.gltf = gltf;
            this.threeObject = gltf.scene;
            this.mesh = gltf.scene;
            gltf.scene.position.set(this.x, this.y, this.z);
            gltf.scene.traverse( node => {
              if ( node instanceof THREE.Mesh ){
                if (this.gltf.animations.length > 0) {
                  gltf.scene.scale.set(this.scale,this.scale,this.scale);
                }else{
                  node.geometry.scale(this.scale, this.scale, this.scale)
                }
                node.castShadow = true;
                node.receiveShadow = true;
                node.side = THREE.DoubleSide;
              }
            });
            resolve(this);
         }catch(e){
          reject(e);
         }
        },
        (xhr) => {// on Load
          let percentLoaded = ( xhr.loaded / xhr.total * 100 )
          console.log( this.model + " " + percentLoaded + '% loaded' );
        },
        (e) => {// on Error
          console.log(e);
        }
      )
    });
  }

  initBoundingBoxPhysics(){

    this.helper = new THREE.BoxHelper(this.mesh, 0xff0000);
    var bbox = new THREE.Box3().setFromObject(this.helper);

    let w = (bbox.max.x - bbox.min.x)*.5;
    let h = (bbox.max.y - bbox.min.y)*.5;
    let d = (bbox.max.z - bbox.min.z)*.5;
    
    console.log(w, h, d)
    console.log(this.helper)
    
    // let boxShape = new AMMO.btBoxShape(new AMMO.btVector3(w, h, d));
    let boxShape = new AMMO.btBoxShape(new AMMO.btVector3(w, h, d));
    
    this.initPhysics(this.mass, boxShape);
    this.scene.scene.add(this.helper);
  }

  initConcavePhysics(){
    
    let triangles = new Array(0);
    this.gltf.scene.traverse( node => {
      if ( node instanceof THREE.Mesh ){
        let geometry = new THREE.Geometry().fromBufferGeometry( node.geometry );
        geometry.mergeVertices();
        triangles = this.trianglesFromGeomerty(geometry, triangles);
      }
    });

    let
      triangle_mesh = new AMMO.btTriangleMesh,
      _vec3_1 = new AMMO.btVector3(),
      _vec3_2 = new AMMO.btVector3(), 
      _vec3_3 = new AMMO.btVector3();

    for ( let i = 0; i < triangles.length; i++ ) {
      let triangle = triangles[i];

      _vec3_1.setX(triangle[0].x);
      _vec3_1.setY(triangle[0].y);
      _vec3_1.setZ(triangle[0].z);

      _vec3_2.setX(triangle[1].x);
      _vec3_2.setY(triangle[1].y);
      _vec3_2.setZ(triangle[1].z);

      _vec3_3.setX(triangle[2].x);
      _vec3_3.setY(triangle[2].y);
      _vec3_3.setZ(triangle[2].z);

      triangle_mesh.addTriangle(
        _vec3_1,
        _vec3_2,
        _vec3_3,
        true
      );
    }

    let shape = new AMMO.btBvhTriangleMeshShape(
      triangle_mesh,
      true,
      true
    );
    
    this.initPhysics(this.mass, shape);
  }

  trianglesFromGeomerty(geometry, triangles){
    let vertices = geometry.vertices;
    for ( let i = 0; i < geometry.faces.length; i++ ) {
			let face = geometry.faces[i];
			if ( face instanceof THREE.Face3) {
				triangles.push([
					{ x: vertices[face.a].x, y: vertices[face.a].y, z: vertices[face.a].z },
					{ x: vertices[face.b].x, y: vertices[face.b].y, z: vertices[face.b].z },
					{ x: vertices[face.c].x, y: vertices[face.c].y, z: vertices[face.c].z }
				]);
			} else if ( face instanceof THREE.Face4 ) {
				triangles.push([
					{ x: vertices[face.a].x, y: vertices[face.a].y, z: vertices[face.a].z },
					{ x: vertices[face.b].x, y: vertices[face.b].y, z: vertices[face.b].z },
					{ x: vertices[face.d].x, y: vertices[face.d].y, z: vertices[face.d].z }
				]);
				triangles.push([
					{ x: vertices[face.b].x, y: vertices[face.b].y, z: vertices[face.b].z },
					{ x: vertices[face.c].x, y: vertices[face.c].y, z: vertices[face.c].z },
					{ x: vertices[face.d].x, y: vertices[face.d].y, z: vertices[face.d].z }
				]);
			}
    }
    return triangles;
  }

  playAnimation(aNum = 0){
    if( this.gltf.animations.length > 0){
      this.mixer = new THREE.AnimationMixer(this.gltf.scene);
      this.mixer.clipAction(this.gltf.animations[aNum]).play();
    }
  }
}
