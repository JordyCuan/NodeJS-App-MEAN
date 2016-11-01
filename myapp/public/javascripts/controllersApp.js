//CONTROLADOR PARA EL REGISTRO E INICIO DE SESION DE USUARIOS
app.controller('signin-signup', function($scope, serviceObjs) 
{
  $scope.register = false;
  $scope.login = true;
  $scope.newUser = {};
  var flag = 0; 
  

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


     $scope.user = {};
    $scope.submitData = function()
    {
      serviceObjs.postData($scope.user, '/login')
      .then( 
        function mySucces(response) {
          window.location = "/principal";
        }, 
        function myError(response) {
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
});




//CONTROLADOR PARA LA PAGINA PRINCIPAL
app.controller('principalCtrl', function($scope, serviceObjs)
{

  //Se muestra la lista de objs que tiene el usuario
  serviceObjs.getData('/user/files')
  .then (function mySucces(response)
    {
      $scope.objs = response.data;
    }, function myError(response)
    { 
      $scope.msgObj = "An error ocurred while show first time the obj list";
    }
  )

  //Scope para visualizar el obj antes de subirlo al servidor
  $scope.renderFile = function(files)
  {
    //leer el contenido del archivo local para pasarlo a la directive del renderizado
    if (files != null)
    {
      //opcion uno, para renderizar de manera local
      var option = 1;
      var file = files[0];
      var r = new FileReader();
      //Se lee el contenido del archivo
      r.onload = function(e) { 
                  objData = e.target.result;
                  //Se pasa al directive para renderizar
                  $scope.$broadcast('renderPrev', objData);
            }
            r.readAsText(file);
          } else { 
            alert("Failed to load file");
    }

  }

  //Scope para enviar un archivo al servidor
  $scope.sendFile= function ()
  {
    formData = new FormData(document.forms.namedItem("fileinfo"));
    serviceObjs.uploadFile(formData)
    .then (function mySucces(response)
      {
        //Si el archivo ya se encuentra en el servidor
        if (response.data == 11000)
          $scope.msg = "No se permiten nombres duplicados";

        //En caso contrario se actualiza la lista
        else{
          $scope.msg = "UPLOAD SUCCESSFULL"
          serviceObjs.getData('/user/files')
          .then (function mySucces(response)
            {
              $scope.objs = response.data;
            }, function myError(response)
            { 
              $scope.msgObj = "An error ocurred while show the obj list";
            }
        )}

      },function myError(response)
      {
        $scope.msg = "An error ocurred at upload file";
      }
    )
  }

  //Scope del obj a renderizar
  $scope.decimar = function()
  {
    var broadcast;
    //Recibo el identificar del archivo a previsualizar
    if ( $scope.filesObj == undefined || $scope.filesObj == null ||
          $scope.porcentaje == undefined || $scope.porcentaje == null )
    {
      alert("Select a file and percentage to decimation");
    }
    else
    {
      //Se manda a decimar el archivo
      var formData = {
                  "obj"        : $scope.filesObj._originalname,
                  "porcentaje" : $scope.porcentaje
                };

      //serviceObjs.decimation(form_data)
      serviceObjs.postData(formData, '/decimar')
        .then (function mySucces(response)
          {
            alert("DECIMATION SUCCESSFULL");
            $scope.$broadcast('renderObjs', $scope.filesObj._originalname);
          }, function myError(response)
          { 
            $scope.msgObj = "Ocurrio un error en la decimacion";
          }
        )
    }
  }
 





});



