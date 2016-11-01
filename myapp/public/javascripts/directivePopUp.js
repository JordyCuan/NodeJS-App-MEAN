//Esta directiva muestra un mensaje popup
app.directive('popUp', function(){


    return {
      restrict: 'A',
      //templateUrl: '/pages/popup.html',
      link: function(scope, element, attrs){
      	//Se muestra una ventana emergente con datos especificos de cada controlador que la solicita
      	scope.$on('showPopUp', function (cabecera, msg) {
            scope.newUser.name = "";
            scope.newUser.email = "";
            scope.newUser.password = "";
            scope.newUser.confirm = "";
            alert('registro exitoso');

            //scope.cabecera = cabecera;
            //scope.msg = msg;
        });
      }
  }
}); //END directive