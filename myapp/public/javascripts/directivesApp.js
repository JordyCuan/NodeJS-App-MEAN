  app.directive('renderObj', function(){


    return {

      restrict: 'A',
      scope: true,
      template: "<input type='button' name='boton' ng-click='renderObjs()' value='RENDER'><div id='canvas'><div id='template'></div><div id='content'></div></div>",
      link: function(scope, element, attrs){

        var scenes= [],canvas, renderer, container, idAnimation, cont=0;

        var mouseX = 0, mouseY = 0;

        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;

        scope.renderObjs = function ()
        {
          if ( scope.filesObj == undefined || scope.filesObj == null )
          {
            alert("NO HAS SELECCIONADO ALGÚN OBJETO");
          }
          else
          {
            if (cont ++ >= 1)
              cleanContainer();
            var urlPrev = '/file/original/'+scope.filesObj._originalname;
            renderizado(urlPrev);
            //var urlDec = '/file/decimado/'+scope.filesObj._originalname;
            //renderizado(urlDec);
          }

        }


        function renderizado(url)
        {
          scope.init = function()
          {

            //container = document.getElementById("objrender");
            //document.body.appendChild( container );

            //container = angular.element('<div>')[0];
            //element[0].appendChild(container);


            canvas = document.getElementById("canvas");
            var template = document.getElementById("template").text;
            var content = document.getElementById("content");

            for(var i=0; i<2; i++)
            {
              var scene = new THREE.Scene();
              var element = document.createElement("div");
              element.className = "list-item";
              element.innerHTML = template.replace ('$', i+1);


              var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
              camera.position.z = 600;

              // scene
              //scene = new THREE.Scene();

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

            //Modelo
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

              renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
              renderer.setSize( window.innerWidth/2, window.innerHeight/2);
              container.appendChild( renderer.domElement );

              document.addEventListener( 'mousemove', scope.onDocumentMouseMove, false );

              window.addEventListener( 'resize', scope.onWindowResize, false );
              var controls = new THREE.OrbitControls(camera, renderer.domElement);
              scenes.push (scene);
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
