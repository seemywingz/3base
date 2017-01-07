/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */
/*eslint-disable*/
import * as THREE from 'three';

export function loadControls() {

  THREE.PointerLockControls = function ( camera ) {

      var scope = this;

      var pitchObject = new THREE.Object3D();
      pitchObject.add( camera );

      var yawObject = new THREE.Object3D();
      yawObject.position.y = 10;
      yawObject.add( pitchObject );

      var velocity = new THREE.Vector3();

      var PI_2 = Math.PI / 2;

      var onMouseMove = function ( event ) {

          if ( scope.enabled === false ) return;

          var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
          var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

          yawObject.rotation.y -= movementX * 0.002;
          pitchObject.rotation.x -= movementY * 0.002;

          pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

      };

      document.addEventListener( 'mousemove', onMouseMove, false );

      this.getObject = function () {
          return yawObject;
      };

  };
}
/*eslint-enable*/
