  app.directive('renderObjPrev', function(){


    return {

      restrict: 'AEC',
      templateUrl: '/pages/renderPrev.html',
      link: function(scope, element, attrs){

          //Declaracion de variables a usar
          var camera, scene, renderer, idAnimation, controls, previous, canvas;

          var mouseX = 0, mouseY = 0;

          var windowHalfX = window.innerWidth / 2;
          var windowHalfY = window.innerHeight / 2;

          //Llamo el container de /pages/render.html
          //container = document.getElementById("container");

          container = angular.element('<div>')[0];
          element[0].appendChild(container);

          canvas = document.getElementById("canvasPrevio");
          //canvas.width = 400;
          //canvas.height = 700;

          var manager = new THREE.LoadingManager();
          manager.onProgress = function ( item, loaded, total ) {
          console.log( item, loaded, total );
          scope.msg = (loaded / total * 100) + '%';
          };

          //Se crean los objetos para el renderizado
          var loaderXhr = new THREE.XHRLoader(manager);

          //OBJloader para el renderizado local -----------------------------------------------
          var loader = new THREE.OBJLoader();
          // Add a localtext parameter and an if check if url == ""
          

          //------------------------------------------------------------------------------------
          scope.$on('cleanContainerPrev', function(event){
            cleanRender();
          })

          //inicializar scenePrev
          init();

          //Se crea un broadcast que espere al scope del boton de renderizado
          scope.$on('renderPrev', function (event, oldFile, newFile, option){
            //if (oldFile != newFile)
              loadModel(newFile, option);
          }); //END broadcast
          
          //funcion para renderizar objeto
          function loadModel (newFile, option)
          {
            if (previous)
              scene.remove(previous);
            //option 1 es renderizado desde server
            if (option == 1)
            {
              var url = '/file/original/'+newFile;
                loaderXhr.load( url, function ( object ) 
                {
                  var objLoader = new THREE.OBJLoader();
                  objLoader = objLoader.parse(object);
                  objLoader.scale.x = 10;
                  objLoader.scale.y = 10;
                  objLoader.scale.z = 10;
                  var obj = objLoader;
                  previous = obj;
                  scene.add( obj );

                } );
            }

            //cualquier otra opcion, renderizado local
            else
            {
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
              }

              // Now you can use either url or directly string input.
              loader.load( '', newFile, function ( object ) {
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
            } //end if(option== 0)

            
          } //END loadModel

          animate();

          function init()
          {

            camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 2000 );
            camera.position.z = 600;

            // scene
            scene = new THREE.Scene();

            var ambient = new THREE.AmbientLight( 0x101030 );
            scene.add( ambient );

            var directionalLight = new THREE.DirectionalLight( 0xffeedd );
            directionalLight.position.set( 0, 0, 1 );
            scene.add( directionalLight );

            renderer = new THREE.WebGLRenderer( { canvas: canvas } );
            renderer.setSize( canvas.width, canvas.height);
            container.appendChild( renderer.domElement );

            document.addEventListener( 'mousemove', onDocumentMouseMove, false );

            window.addEventListener( 'resize', onWindowResize, false );
            controls = new THREE.OrbitControls(camera, renderer.domElement);

          }  //END init

          function onWindowResize()
          {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = canvas.width / canvas.height;
            camera.updateProjectionMatrix();

            renderer.setSize( canvas.width, canvas.height);
          }

          function onDocumentMouseMove ( event ) 
          {
            mouseX = ( event.clientX - windowHalfX ) / 2;
            mouseY = ( event.clientY - windowHalfY ) / 2;
          }

          function animate () 
          {
            idAnimation = requestAnimationFrame( animate );
            render();
          }

          function render () 
          {
            renderer.render( scene, camera );
            controls.update();
          }

          function cleanRender()
          {
            cancelAnimationFrame( idAnimation);
            scene.remove(obj);
            controls = undefined;
            camera = undefined;
            renderer = undefined;
            scene = undefined;
            obj = undefined;
            container.removeChild(renderer.domElement);
            container = null;
          }

      } //end link
    }; //end return
  }); //end directive



//Directiva de objeto renderizado a visualizar

  app.directive('renderObjPost', function(){


    return {

      restrict: 'AEC',
      templateUrl: '/pages/renderPost.html',
      link: function(scope, element, attrs){

          //Declaracion de variables a usar
          var camera, scene, renderer, idAnimation, controls, previous, canvas;

          var mouseX = 0, mouseY = 0;

          var windowHalfX = window.innerWidth / 2;
          var windowHalfY = window.innerHeight / 2;

          //Llamo el container de /pages/render.html
          //container = document.getElementById("container");
          container = angular.element('<div>')[0];
          element[0].appendChild(container);

          canvas = document.getElementById("canvasPost");
          //canvas.width = 400;
          //canvas.height = 700;

          //Se crean los objetos para el renderizado
          var loaderXhr = new THREE.XHRLoader();

          //lIMPIAR EL RENDERIZADO CUANDO SE FINALIZA LA SESION
          scope.$on('cleanContainerPost', function(event){
            cleanRender();
          })


          //inicializar scenePrev
          init();

          //Se crea un broadcast que espere al scope del boton de renderizado
          scope.$on('renderPost', function (event, oldFile, newFile, option){
            //if (oldFile != newFile)
              loadModel(newFile, option);
          }); //END broadcast
          
          //funcion para renderizar objeto
          function loadModel (newFile, option)
          {
            if (previous)
              scene.remove(previous);

              var url = '/file/decimado/'+newFile;
                loaderXhr.load( url, function ( object ) 
                {
                  var objLoader = new THREE.OBJLoader();
                  objLoader = objLoader.parse(object);
                  objLoader.scale.x = 10;
                  objLoader.scale.y = 10;
                  objLoader.scale.z = 10;
                  var obj = objLoader;
                  previous = obj;
                  scene.add( obj );

                } );
          
            
          } //END loadModel

          animate();

          function init()
          {

            camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 2000 );
            camera.position.z = 600;

            // scene
            scene = new THREE.Scene();

            var ambient = new THREE.AmbientLight( 0x101030 );
            scene.add( ambient );

            var directionalLight = new THREE.DirectionalLight( 0xffeedd );
            directionalLight.position.set( 0, 0, 1 );
            scene.add( directionalLight );

            renderer = new THREE.WebGLRenderer( { canvas: canvas } );
            renderer.setSize( canvas.width, canvas.height);
            container.appendChild( renderer.domElement );

            document.addEventListener( 'mousemove', onDocumentMouseMove, false );

            window.addEventListener( 'resize', onWindowResize, false );
            controls = new THREE.OrbitControls(camera, renderer.domElement);

          }  //END init

          function onWindowResize()
          {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = canvas.width / canvas.height;
            camera.updateProjectionMatrix();

            renderer.setSize( canvas.width, canvas.height);
          }

          function onDocumentMouseMove ( event ) 
          {
            mouseX = ( event.clientX - windowHalfX ) / 2;
            mouseY = ( event.clientY - windowHalfY ) / 2;
          }

          function animate () 
          {
            idAnimation = requestAnimationFrame( animate );
            render();
          }

          function render () 
          {
            renderer.render( scene, camera );
            controls.update();
          }

          function cleanRender()
          {
            cancelAnimationFrame( idAnimation);
            scene.remove(obj);
            controls = undefined;
            camera = undefined;
            renderer = undefined;
            scene = undefined;
            obj = undefined;
            container.removeChild(renderer.domElement);
            container = null;
          }

      } //end Link
    }; //end return
  }); //end directive
