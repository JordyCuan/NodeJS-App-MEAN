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
        $scope.msg = "UPLOAD SUCCESSFULL";
        //Si el upload fue exitoso de actualiza la lista de objs
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
  /*$scope.decimar = function()
  {
    //Recibo el identificar del archivo a previsualizar
    if ( $scope.filesObj == undefined || $scope.filesObj == null )
    {
      alert("NO HAS SELECCIONADO NADA");
    }
    else
    {
      var objSelected = $scope.filesObj._originalname;
      //Consumme el endpoint para renderizar el obj antes de decimarlo
      serviceObjs.getData('/file/original/'+objSelected)
      .then(function mySucces (response)
        {
          $scope.msgObj = "DOWNLOAD SUCCESSFULL";
          //Si la previsualizacion es exitosa, se manda a decimar el mismo archivo para visualizarlo posteriormente
          serviceObjs.getData( '/file/decimado/'+objSelected)
          .then (function mySucces(response)
            {
              $scope.msgObj = "El archivo decimado se descargo exitosamente";
            }, function myError(response)
            {
              $scope.msgObj = "An error ocurred while downloading the file decimate";
            }
          )
        }, function myError(response)
        {
          $scope.msgObj = "An error ocurred while download the file";
        }
      )
    }
  }*/
 



});



