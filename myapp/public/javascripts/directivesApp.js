  app.directive('renderObjDir', function(){


    return {

      restrict: 'A',
      //scope: true,
      link: function(scope, element, attrs){

        var camera, scene, renderer, material, container, idAnimation, cont=0, obj;

        var mouseX = 0, mouseY = 0;

        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;

        scope.$on('renderObjs', function (event, nameFile) {
          /*if ( scope.filesObj == undefined || scope.filesObj == null )
          {
            alert("NO HAS SELECCIONADO ALGÚN OBJETO");
          }
          else
          {*/
            alert(nameFile);
            if (cont ++ >= 1)
              cleanContainer();
            var urlPrev = '/file/original/'+scope.filesObj._originalname;
            renderizado(urlPrev);
            //var urlDec = '/file/decimado/'+nameFile;
            //renderizado(urlDec);
          //}

        });


        function renderizado(url, option)
        {
          scope.init = function()
          {

            //container = document.getElementById("objrender");
            //document.body.appendChild( container );

            container = angular.element('<div>')[0];
            element[0].appendChild(container);

            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
            camera.position.z = 600;

            // scene
            scene = new THREE.Scene();

            var ambient = new THREE.AmbientLight( 0x101030 );
            scene.add( ambient );

            var directionalLight = new THREE.DirectionalLight( 0xffeedd );
            directionalLight.position.set( 0, 0, 1 );
            scene.add( directionalLight );

            // texture
            var manager = new THREE.LoadingManager();
            manager.onProgress = function ( item, loaded, total ) {

              console.log( item, loaded, total );

            };

          //Modelo si opcion es 0
          //if (option == 0)
          //{
            var loader = new THREE.XHRLoader( manager );
              loader.load( url, function ( object ) 
              {
                var objLoader = new THREE.OBJLoader();
                objLoader = objLoader.parse(object);
                objLoader.scale.x = 10;
                objLoader.scale.y = 10;
                objLoader.scale.z = 10;
                obj = objLoader;
                scene.add( obj );

              } );
          //}

          /*if(option == 1)
          {
              // model
            var loader = new THREE.OBJLoader();
            // Add a localtext parameter and an if check if url == ""
            loader.load =   function load( url, localtext, onLoad, onProgress, onError ) {
            var scope = this;
            var loader = new THREE.XHRLoader( scope.manager );
            loader.setPath( this.path );
            loader.load( url, function ( text ) {
              if (url==""){
                text = localtext;
              }
              onLoad( scope.parse( text ) );
              }, onProgress, onError );
            },

            // Now you can use either url or directly string input.
            loader.load( '', objData, function ( object ) {
              object.traverse( function ( child ) {
              if ( child instanceof THREE.Mesh ) {
                  //MORE INFORMATION
              }
            } );
              
              object.scale.x = 10;
              object.scale.y = 10;
              object.scale.z = 10;
              obj = object;
              scene.add( obj );
            });
          }*/

            renderer = new THREE.WebGLRenderer();
            renderer.setSize( window.innerWidth/2, window.innerHeight/2);
            container.appendChild( renderer.domElement );

            document.addEventListener( 'mousemove', scope.onDocumentMouseMove, false );

            window.addEventListener( 'resize', scope.onWindowResize, false );
            controls = new THREE.OrbitControls(camera, renderer.domElement);

          }

          scope.onWindowResize = function()
          {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth/2, window.innerHeight/2);
          }

          scope.onDocumentMouseMove =  function( event ) 
          {
            mouseX = ( event.clientX - windowHalfX ) / 2;
            mouseY = ( event.clientY - windowHalfY ) / 2;
          }

          scope.animate = function() 
          {
            idAnimation = requestAnimationFrame( scope.animate );
            scope.render();
          }

          scope.render = function() 
          {
            renderer.render( scene, camera );
            controls.update();
          }


          scope.init();
          scope.animate();
        }

        //LIBERAR MEMORIA
        function cleanContainer()
      {
        //si encuentre alguna escena entonces limpia
        /*var indice = container.childElementCount;
        if ( indice >= 1)
        {
          breakFreeMemory();
          while (indice > 0)
            container.removeChild(container.childNodes[indice--]);
        }*/
        container.remove(angular.element('<div>')[0]);
        breakFreeMemory();
      }
        
      //Break free memory before reload object 3D
      function breakFreeMemory()
      {
        //Scene 1
        cancelAnimationFrame( idAnimation);
        scene.remove(obj);
        controls = undefined;
        camera = undefined;
        renderer = undefined;
        scene = undefined;
        obj = undefined;

        //Scene 2
        /*cancelAnimationFrame( idAnimation2);
        scene2.remove(obj2);
        controls2 = undefined;
        camera2 = undefined;
        renderer2 = undefined;
        scene2 = undefined;
        obj2 = undefined;*/
      } 

      }

      };


  });
