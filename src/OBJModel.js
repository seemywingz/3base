'use strict';

import * as THREE from 'three';
import * as AMMO from 'ammo.js';
import MeshObject from './MeshObject';

export default class OBJModel extends MeshObject {

  constructor(scene, x, y, z, model, scale = 1, mass = 1) {
    super(scene, x, y, z, null, scale, mass);
    this.model = model;
    return this.loadOBJ();
  }

  loadOBJ() {
    return new Promise((resolve, reject) => {
      this.scene.manager.objLoader.load(
        this.model + '/scene.obj',
        (obj) => {
          try {
            this.obj = obj;
            this.threeObject = obj;
            obj.position.set(this.x, this.y, this.z);
            resolve(this);
          } catch (e) {
            reject(e);
          }
        },
        (xhr) => { // on Load
          let percentLoaded = (xhr.loaded / xhr.total * 100);
          console.log(this.model + " " + percentLoaded + '% loaded');
        },
        (e) => { // on Error
          console.log(e);
        }
      );
    });
  }

  initBoundingBoxPhysics() {
    let helper = new THREE.BoxHelper(this.obj, 0xff0000);
    let bbox = new THREE.Box3().setFromObject(helper);

    let w = (bbox.max.x - bbox.min.x) * 0.5;
    let h = (bbox.max.y - bbox.min.y) * 0.5;
    let d = (bbox.max.z - bbox.min.z) * 0.5;

    let boxShape = new AMMO.btBoxShape(new AMMO.btVector3(w, h, d));
    this.initPhysics(this.mass, boxShape);

    this.scene.scene.add(helper);
  }

  initConcavePhysics() {
    let triangles = [];
    this.obj.traverse(node => {
      if (node instanceof THREE.Mesh) {
        let geometry = new THREE.BufferGeometry().fromGeometry(node.geometry);
        geometry.attributes.position.array.forEach((vertex, index, array) => {
          if (index % 3 === 0) {
            let triangle = [
              { x: array[index], y: array[index + 1], z: array[index + 2] },
              { x: array[index + 3], y: array[index + 4], z: array[index + 5] },
              { x: array[index + 6], y: array[index + 7], z: array[index + 8] }
            ];
            triangles.push(triangle);
          }
        });
      }
    });

    let triangle_mesh = new AMMO.btTriangleMesh();
    let _vec3_1 = new AMMO.btVector3();
    let _vec3_2 = new AMMO.btVector3();
    let _vec3_3 = new AMMO.btVector3();

    for (let i = 0; i < triangles.length; i++) {
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

      triangle_mesh.addTriangle(_vec3_1, _vec3_2, _vec3_3, true);
    }

    let shape = new AMMO.btBvhTriangleMeshShape(triangle_mesh, true, true);
    this.initPhysics(this.mass, shape);
  }
}
