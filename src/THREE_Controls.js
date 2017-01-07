/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */
/*eslint-disable*/
import * as THREE from 'three';

export function loadControls() {
  THREE.FirstPersonControls = function (object, domElement) {
    this.shiftKey = false;

    this.object = object;

    this.target = new THREE.Vector3(0, 0, -10);

    this.domElement = ( domElement !== undefined ) ? domElement : document;

    this.enabled = true;

    this.movementSpeed = 1.0;
    this.lookSpeed = 0.005;

    this.lookVertical = true;
    this.autoForward = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;

    this. first = true;

    if (this.domElement !== document) {

      this.domElement.setAttribute('tabindex', -1);

    }

    this.handleResize = function () {

      if (this.domElement === document) {

        this.viewHalfX = window.innerWidth / 2;
        this.viewHalfY = window.innerHeight / 2;

      } else {

        this.viewHalfX = this.domElement.offsetWidth / 2;
        this.viewHalfY = this.domElement.offsetHeight / 2;

      }

    };

    this.onMouseDown = function (event) {

      if (this.domElement !== document) {

        this.domElement.focus();

      }

      event.preventDefault();
      event.stopPropagation();

      if (this.activeLook) {

        switch (event.button) {

          case 0:
            this.moveForward = true;
            break;
          case 2:
            this.moveBackward = true;
            break;

        }

      }

      this.mouseDragOn = true;

    };

    this.onMouseUp = function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (this.activeLook) {

        switch (event.button) {

          case 0:
            this.moveForward = false;
            break;
          case 2:
            this.moveBackward = false;
            break;

        }

      }

      this.mouseDragOn = false;

    };

    this.onMouseMove = function (event) {

      if (this.domElement === document) {

        this.mouseX = event.pageX - this.viewHalfX;
        this.mouseY = event.pageY - this.viewHalfY;

      } else {

        this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
        this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

      }

    };

    this.onKeyDown = function (event) {
      //event.preventDefault();

      switch (event.keyCode) {

        case 38: /*up*/
        case 87: /*W*/
          this.moveForward = true;
          break;

        case 37: /*left*/
        case 65: /*A*/
          this.moveLeft = true;
          break;

        case 40: /*down*/
        case 83: /*S*/
          this.moveBackward = true;
          break;

        case 39: /*right*/
        case 68: /*D*/
          this.moveRight = true;
          break;

        case 82: /*R*/
          this.moveUp = true;
          break;
        case 70: /*F*/
          this.moveDown = true;
          break;

        case 16:
          this.shiftKey = true;
          break;

      }
    };

    this.onKeyUp = function (event) {

      switch (event.keyCode) {

        case 38: /*up*/
        case 87: /*W*/
          this.moveForward = false;
          break;

        case 37: /*left*/
        case 65: /*A*/
          this.moveLeft = false;
          break;

        case 40: /*down*/
        case 83: /*S*/
          this.moveBackward = false;
          break;

        case 39: /*right*/
        case 68: /*D*/
          this.moveRight = false;
          break;

        case 82: /*R*/
          this.moveUp = false;
          break;
        case 70: /*F*/
          this.moveDown = false;
          break;

        case 16:/*shift*/
          this.shiftKey = false;
          break;

      }
    };

    this.update = function (delta) {

      if(!this.shiftKey) return;
      if (this.enabled === false) return;

      if (this.heightSpeed) {

        var y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
        var heightDelta = y - this.heightMin;

        this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

      } else {

        this.autoSpeedFactor = 0.0;

      }

      var actualMoveSpeed = delta * this.movementSpeed;

      if (this.moveForward || ( this.autoForward && !this.moveBackward )) this.object.translateZ(-( actualMoveSpeed + this.autoSpeedFactor ));
      if (this.moveBackward) this.object.translateZ(actualMoveSpeed);

      if (this.moveLeft) this.object.translateX(-actualMoveSpeed);
      if (this.moveRight) this.object.translateX(actualMoveSpeed);

      if (this.moveUp) this.object.translateY(actualMoveSpeed);
      if (this.moveDown) this.object.translateY(-actualMoveSpeed);

      var actualLookSpeed = delta * this.lookSpeed;

      if (!this.activeLook) {

        actualLookSpeed = 0;

      }

      var verticalLookRatio = 1;

      if (this.constrainVertical) {

        verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

      }

      this.lon += this.mouseX * actualLookSpeed;
      if (this.lookVertical) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

      this.lat = Math.max(-85, Math.min(85, this.lat));
      this.phi = THREE.Math.degToRad(90 - this.lat);

      this.theta = THREE.Math.degToRad(this.lon);

      if (this.constrainVertical) {

        this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);

      }

      var targetPosition = this.target,
        position = this.object.position;

      targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
      targetPosition.y = position.y + 100 * Math.cos(this.phi);
      targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

      this.object.lookAt(targetPosition);

    };

    function contextmenu(event) {

      event.preventDefault();

    }

    this.dispose = function () {

      this.domElement.removeEventListener('contextmenu', contextmenu, false);
      this.domElement.removeEventListener('mousedown', _onMouseDown, false);
      this.domElement.removeEventListener('mousemove', _onMouseMove, false);
      this.domElement.removeEventListener('mouseup', _onMouseUp, false);

      window.removeEventListener('keydown', _onKeyDown, false);
      window.removeEventListener('keyup', _onKeyUp, false);

    };

    var _onMouseMove = bind(this, this.onMouseMove);
    var _onMouseDown = bind(this, this.onMouseDown);
    var _onMouseUp = bind(this, this.onMouseUp);
    var _onKeyDown = bind(this, this.onKeyDown);
    var _onKeyUp = bind(this, this.onKeyUp);

    this.domElement.addEventListener('contextmenu', contextmenu, false);
    this.domElement.addEventListener('mousemove', _onMouseMove, false);
    this.domElement.addEventListener('mousedown', _onMouseDown, false);
    this.domElement.addEventListener('mouseup', _onMouseUp, false);

    window.addEventListener('keydown', _onKeyDown, false);
    window.addEventListener('keyup', _onKeyUp, false);

    function bind(scope, fn) {

      return function () {

        fn.apply(scope, arguments);

      };

    }

    this.handleResize();

  };// FirstPersonConrtols

  THREE.MouseControls = function ( object ) {

    var scope = this;
    var PI_2 = Math.PI / 2;
    var mouseQuat = {
      x: new THREE.Quaternion(),
      y: new THREE.Quaternion()
    };
    var object = object;
    var xVector = new THREE.Vector3( 1, 0, 0 );
    var yVector = new THREE.Vector3( 0, 1, 0 );

    var onMouseMove = function ( event ) {

      if ( scope.enabled === false ) return;

      var orientation = scope.orientation;

      var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      orientation.y += movementX * 0.0025;
      orientation.x += movementY * 0.0025;

      orientation.x = Math.max( - PI_2, Math.min( PI_2, orientation.x ) );

    };

    this.enabled = true;

    this.orientation = {
      x: 0,
      y: 0
    };

    this.update = function() {

      if ( this.enabled === false ) return;

      mouseQuat.x.setFromAxisAngle( xVector, this.orientation.x );
      mouseQuat.y.setFromAxisAngle( yVector, this.orientation.y );
      object.quaternion.copy( mouseQuat.y ).multiply( mouseQuat.x );
      return;

    };

    this.dispose = function() {

      document.removeEventListener( 'mousemove', onMouseMove, false );

    }

    document.addEventListener( 'mousemove', onMouseMove, false );

  };// MouseControls
  THREE.PointerLockControls = function ( camera ) {

      var scope = this;

      camera.rotation.set( 0, 0, 0 );

      var pitchObject = new THREE.Object3D();
      pitchObject.add( camera );

      var yawObject = new THREE.Object3D();
      yawObject.position.y = 10;
      yawObject.add( pitchObject );

      var moveForward = false;
      var moveBackward = false;
      var moveLeft = false;
      var moveRight = false;

      var isOnObject = false;
      var canJump = false;

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

      var onKeyDown = function ( event ) {

          switch ( event.keyCode ) {

              case 38: // up
              case 87: // w
                  moveForward = true;
                  break;

              case 37: // left
              case 65: // a
                  moveLeft = true; break;

              case 40: // down
              case 83: // s
                  moveBackward = true;
                  break;

              case 39: // right
              case 68: // d
                  moveRight = true;
                  break;

              case 32: // space
                  if ( canJump === true ) velocity.y += 10;
                  canJump = false;
                  break;

          }

      };

      var onKeyUp = function ( event ) {

          switch( event.keyCode ) {

              case 38: // up
              case 87: // w
                  moveForward = false;
                  break;

              case 37: // left
              case 65: // a
                  moveLeft = false;
                  break;

              case 40: // down
              case 83: // s
                  moveBackward = false;
                  break;

              case 39: // right
              case 68: // d
                  moveRight = false;
                  break;

          }

      };

      document.addEventListener( 'mousemove', onMouseMove, false );
      document.addEventListener( 'keydown', onKeyDown, false );
      document.addEventListener( 'keyup', onKeyUp, false );

      this.enabled = false;

      this.getObject = function () {

          return yawObject;

      };

      this.isOnObject = function ( boolean ) {

          isOnObject = boolean;
          canJump = boolean;

      };

      this.getDirection = function() {

          // assumes the camera itself is not rotated

          var direction = new THREE.Vector3( 0, 0, -1 );
          var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

          return function( v ) {

              rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

              v.copy( direction ).applyEuler( rotation );

              return v;

          }

      }();

      this.update = function ( delta ) {

          if ( scope.enabled === false ) return;

          delta *= 0.1;

          velocity.x += ( - velocity.x ) * 0.08 * delta;
          velocity.z += ( - velocity.z ) * 0.08 * delta;

          velocity.y -= 0.25 * delta;

          if ( moveForward ) velocity.z -= 0.12 * delta;
          if ( moveBackward ) velocity.z += 0.12 * delta;

          if ( moveLeft ) velocity.x -= 0.12 * delta;
          if ( moveRight ) velocity.x += 0.12 * delta;

          if ( isOnObject === true ) {

              velocity.y = Math.max( 0, velocity.y );

          }

          yawObject.translateX( velocity.x );
          yawObject.translateY( velocity.y );
          yawObject.translateZ( velocity.z );

          if ( yawObject.position.y < 10 ) {

              velocity.y = 0;
              yawObject.position.y = 10;

              canJump = true;

          }

      };

  };
}
/*eslint-enable*/
