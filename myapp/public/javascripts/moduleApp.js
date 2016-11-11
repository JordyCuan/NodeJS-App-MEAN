var app = angular.module('appDecimation' , ['ngCookies', 'ngRoute']);

app.config(function($routeProvider){
	$routeProvider.when("/login",{
		controller: "signin-signup",
		templateUrl: "views/login.ejs"
	})
	.when("/principal",{
		controller: "principalCrtl",
		templateUrl:"views/principal.ejs"
	})
	.otherwise({redirectTo: "/login"});
})
