app.service("serviceObjs", function($http)
{

   //MUESTRA LA LISTA DE ARCHIVOS OBJ
   this.getObjs = function()
   {
      return $http({
                     method: 'GET',
                     url: '/user/files',
                  })
                  .then(function (data)
                  { 
                     return data;
                  });
   }


   //eNVIAR UN ARCHIVO AL SERVIDOR
   this.uploadFile = function(formdata)
   {
      return $http.post('/upload', formData, { transformRequest: angular.identity,
                     headers: {'Content-Type': undefined}
                  }).then(function (response)
                  {
                     return response;
                  });
   }


});	