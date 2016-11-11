//CONTROLADOR PARA EL REGISTRO E INICIO DE SESION DE USUARIOS
app.controller('signin-signup', function($scope, serviceObjs, userCookies) 
{
  $scope.register = false;
  $scope.login = true;
  $scope.newUser = {};
  var flag = 0; 

  //scope para registrar un nuevo usuario
  $scope.toRegister = function()
  {
    if (flag >= 1)
    {
      $scope.checkPassword = "";
      $scope.checkEmail = "";
      flag = 0;
    }
    if (serviceObjs.emailValidate($scope.newUser.email) == 1)
    {
      $scope.checkEmail = "Verifica tu correo electronico";
      flag = 1;
    }  
    else 
    {
      if (serviceObjs.passwordValidate($scope.newUser.password, $scope.newUser.confirm) == 1) 
      {
        $scope.checkPassword = "Las contraseñas no coinciden";
        flag = 1;
      }
     else
      {
        //Si los datos son correctos
        serviceObjs.addUser($scope.newUser)
        .then( 
          function mySucces() {
            alert("Registro exitoso");
            //$scope.$broadcast('showPopUp', 'Registro exitoso' , 'Bienvenido');
            $scope.newUser.name = "";
            $scope.newUser.email = "";
            $scope.newUser.password = "";
            $scope.newUser.confirm = "";
          }, 
          function myError(response) {
            $scope.errorInitSession = "Verifica tus datos e intenta de nuevo";
          });
      }
    }
  }

  //Iniciar sesion del usuario
  $scope.user = {};
  $scope.submitData = function()
  {
    serviceObjs.initSession($scope.user)
    .then( 
      function mySucces(response) {
        userCookies.login($scope.user.email);
        window.location = "/principal";
      }, 
      function myError(response) {
        $scope.user.email = "";
        $scope.user.password = "";
        $scope.errorInitSession = "Verifica tus datos e intenta de nuevo";
      });
  }


      //Ocultar formulario de registro
  $scope.showRegister = function ()
  {
    $scope.register = true;
    $scope.login = false;
  }

  $scope.showLogin = function()
  {
    $scope.register = false;
    $scope.login = true;
  }

}); //end controller signin-signup




//CONTROLADOR PARA LA PAGINA PRINCIPAL
app.controller('principalCtrl', function($scope, $location, serviceObjs, userCookies)
{
  var flagRender = 0;
  var prev, selectedObj;

  $scope.porcentaje = 50;

  //no recuerdo para qu elo queria
  /*var home = angular.element($window);
  $scope.$watch(function(){
    alert("Hola");
  })*/


  //Mostrar los datos del usuario
  $scope.msg = "Bienvenido "+ userCookies.getName();


  //Se muestra la lista de objs que tiene el usuario
  serviceObjs.getData('/user/files')
  .then (function mySucces(response)
    {
      $scope.objs = response.data;
    }, function myError(response)
    { 
      $scope.msg = "Ha ocurrido un error al visualizar la lista de archivos OBJ";
    }
  )

  //Scope para visualizar el obj antes de subirlo al servidor
  $scope.renderFile = function(files)
  {
    //leer el contenido del archivo local para pasarlo a la directive del renderizado
    if (files != null)
    {
      //opcion uno, para renderizar de manera local
      var file = files[0];
      var r = new FileReader();
      
      //Se lee el contenido del archivo
      r.onload = function(e) { 
                  objData = e.target.result;
                  //Se pasa al directive para renderizar
                  $scope.$broadcast('renderPrev', objData, 0);
                }
      r.readAsText(file);
      
      //Cargar el archivo al servidor antes de renderizarlo
      formData = new FormData(document.forms.namedItem("fileinfo"));
      serviceObjs.uploadFile(formData)
      .then (function mySucces(response)
        {
          //Si el archivo ya se encuentra en el servidor
          if (response.data == 11000)
            $scope.msg = "Error al cargar el archivo, no se permiten nombres duplicados";

          //En caso contrario se actualiza la lista
          else{
            $scope.msg = "Se envió correctamente el archivo OBJ al servidor "
            serviceObjs.getData('/user/files')
            .then (function mySucces(response)
              {
                $scope.objs = response.data;
              }, function myError(response)
              { 
                $scope.msg = "Ocurrio un error mientras se mostraba la lista";
              }
          )}

        },function myError(response)
        {
          $scope.msg = "Ocurrio un error mientras se envia el archivo al servidor";
        }
      ) //serviceObjs.uploadFile(...)

    }
    else 
    { 
      $scope.msg = "Ocurrio un error al leer el archivo antes de rederizarlo, selecciona un archivo e intenta de nuevo";
    }

  } //end Scope.renderFile(...)

  //Scope del obj a renderizar
  $scope.decimate = function()
  {

    $scope.msg = ""
    
    //Recibo el identificar del archivo a previsualizar
    if ( $scope.selectedObj == undefined || $scope.selectedObj == null ||
          $scope.porcentaje == undefined || $scope.porcentaje == null )
    {
      $scope.msg = "Selecciona un archivo OBJ y un porcentaje para la decimación";
    }
    else
    {
      prev = selectedObj;
      selectedObj = $scope.selectedObj;
      porcentaje = $scope.porcentaje ;
      if ($scope.porcentaje > 100 || $scope.porcentaje< 0)
        $scope.msg = "Ingresa un número entre 0 y 100 para decimar de manera correcta";
      else{

      $scope.$broadcast('renderPrev',prev, selectedObj, 1);

      //Se manda a decimar el archivo
      var formData = {
                  "obj"        : selectedObj,
                  "porcentaje" : $scope.porcentaje
                };

      //serviceObjs.decimation(form_data)
      serviceObjs.postData(formData, '/decimar')
        .then (function mySucces(response)
          {
            $scope.msg = selectedObj +" fue decimado al "+porcentaje+"% de manera correcta";
            $scope.$broadcast('renderPost', prev, selectedObj);
          }, function myError(response, status)
          { 
            if(status == 401)
              alert("Necesitas iniciar sesión");
            $scope.msg = "Ocurrio un error en la decimacion";
          }
        )
    }
  }
  } //end scope.decimar(..)


  //Scope para salir
  $scope.logout = function()
  {
    $scope.$broadcast("cleanContainerPrev");
    $scope.$broadcast("cleanContainerPost");
    serviceObjs.logout();
  } 

}); //END controller 



