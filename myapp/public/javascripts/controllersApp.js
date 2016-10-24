//CONTROLADOR DE INICIO DE SESSION

//probar este controlador ya que es exclusivo de login.html
app.controller('initSession', function($scope, $http) 
{
  // create a blank object to handle form data.
    $scope.user = {};
  // calling our submit function.
    $scope.submitData = function () {
      $http.post("/login", $scope.user)
      .then( 
        function mySucces(response) {
          window.location = "/principal";
        }, 
        function myError(response) {
          $scope.errorInitSession = "Verifica tus datos e intenta de nuevo";
        }
      );
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

  //Controlador para enviar un archivo al servidor
  $scope.sendFile= function ()
  {
    formData = new FormData(document.forms.namedItem("fileinfo"));
    serviceObjs.uploadFile(formData)
    .then (function mySucces(response)
      {
        $scope.msg = response.data;
        //Si el upload fue exitoso se actualiza la lista de objs
        serviceObjs.getData('/user/files')
        .then (function mySucces(response)
          {
            $scope.objs = response.data;
          }, function myError(response)
          { 
            $scope.msgObj = "An error ocurred while show the obj list";
          }
        )
      },function myError(response)
      {
        $scope.msg = "An error ocurred at upload file";
      }
    )
  }

  //Controlador del obj a renderizar
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
      var form_data = {
                  "obj"        : $scope.filesObj._originalname,
                  "porcentaje" : $scope.porcentaje
                };

      serviceObjs.decimation(form_data)
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



