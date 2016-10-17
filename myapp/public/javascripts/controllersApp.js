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
          $scope.errorInitSession = "ERROR, intenta de nuevo";
        }
      );
    }
});


//CONTROLADOR PARA LA PAGINA PRINCIPAL
app.controller('principalCtrl', function($scope, serviceObjs)
{
  //SE MUESTRA LA LISTA DE ARCHIVOS OBJ DEL USUARIO QUE INICIO SESION
  var list = serviceObjs.getObjs();
  list.then (function mySucces(response)
  {
    $scope.objs = response.data;
  }, function myError(response)
  { 
    $scope.msgObj = "An error ocurred while show first time the obj list";
  }
  )

  //ENVIAR ARCHIVO AL SERVIDOR
  $scope.sendFile= function ()
  {
    formData = new FormData(document.forms.namedItem("fileinfo"));
    var completeUploadMsg = serviceObjs.uploadFile(formData)
    completeUploadMsg.then (function mySucces(response)
    {
      $scope.msg = "UPLOAD SUCCESSFULL";
      //ACTUALIZAR LA LISTA DE OBJS DEL USUARIO
      var list = serviceObjs.getObjs();
      list.then (function mySucces(response)
        {
          $scope.objs = response.data;
        },function myError(response)
          {
            $scope.msgObj = "An error ocurred while update OBJ list";
          }
      )
      },function myError(response)
          {
            $scope.msg = "An error ocurred at upload file";
          }
      )
  }

  //VER OBJETO ANTES DE DECIRMAR
  $scope.decimar = function()
  {
    //Recibo el identificar del archivo a previsualizar
    if ( $scope.filesObj == undefined || $scope.filesObj == null )
    {
      alert("NO HAS SELECCIONADO NADA");
    }
    else
    {
      var idObjSelected = $scope.filesObj._originalname;
      $scope.msgObj = idObjSelected;
    }
  }
 



});




