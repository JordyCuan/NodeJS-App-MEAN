app.service("serviceObjs", function($http)
{
   return({
            initSession: initSession,
            getData: getData,
            uploadFile: uploadFile,
            postData: postData,
            addUser: addUser,
            emailValidate: emailValidate,
            passwordValidate: passwordValidate,

         });


//iniciar Session
   function initSession(formData)
   {
      return $http.post('/login', formData
                  ).then(function (response)
                  {
                     return response;
                  });
   }

   //Consume cualquier enpoint que retorne "algo"
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

   //Carga el archivo al servidor
   function uploadFile (formData)
   {
      return $http.post('/upload', formData, { transformRequest: angular.identity,
                     headers: {'Content-Type': undefined}
                  }).then(function (response)
                  {
                     return response;
                  });
   }


   function postData(formData, url)
   {
      return $http.post(url, formData
                  ).then(function (response)
                  {
                     return response;
                  });
   }

  
   function addUser(dataUser)
   {
      return $http.post('/signup', dataUser
                  ).then(function (response)
                  {
                     return response;
                  });
   }

   //Verificar datos

   function emailValidate(email)
   {
         var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         var msj ="";
         var result = 0; //Si el correo es correcto result = 0
         if(!re.test(email))
            result = 1;
        return result;    
   }

      

   function passwordValidate(password, confirm)
   {
      var result = 0; //Si las contraseñas coinciden result = 0
      if(password != confirm)
         result = 1;
      return result;

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


});	//End de service('serviceObjs'...)



//service de control de cookies del usuario
app.service("userCookies", ["$cookies", function($cookieStore, $location, $http){
   return({
      login: login,
      logout: logout,
      getName: getName,
      checkStatus: checkStatus

   });


   function login(username)
   {
      userName  = username;
      $cookieStore.put('userName', username);
   }

   function logout()
   {
      userName = "";
      $cookieStore.remove('userName');
      return $http({
                     method: 'GET',
                     url: '/signout',
                  })
                  .then(function (data)
                  { 
                     return data;
                  });

   }

   function getName()
   {
      return $cookieStore.get('userName');
   }

   function checkStatus()
   {
      var privatePaths= ['/principal'];
      if($cookies.get('userName') == null)
      {
         $location.path("/login");
      }

      if($cookies.get('userName') != "undefined")
      {
         $location.path("/principal");
      }

      return(location.path());
   }



   }]);
