app.service("serviceObjs", function($http)
{
   return({
            getData: getData,
            uploadFile: uploadFile

         });

   //consume cualquier enpoint que retorne "algo"
   function getData (endpoint)
   {
      return $http({
                     method: 'GET',
                     url: endpoint,
                  })
                  .then(function (data)
                  { 
                     return data;
                  });
   }

   //carga el archivo al servidor
   function uploadFile (formdata)
   {
      return $http.post('/upload', formData, { transformRequest: angular.identity,
                     headers: {'Content-Type': undefined}
                  }).then(function (response)
                  {
                     return response;
                  });
   }

   //Manejadores de errores
   function handleError( response ) 
   {
      if (! angular.isObject( response.data ) || ! response.data.message) 
      {
         return( $q.reject( "An unknown error occurred." ) );
      }
      return( $q.reject( response.data.message ) );
   }

   function handleSuccess( response ) 
   {
      return( response.data );
   }




});	