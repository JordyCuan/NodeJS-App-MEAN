app.factory ("authentication", function($cookies, $cookieStore)
{
	return
	({
		login : login,
		logout: logout,
		getData: getData
		
	});

	function login(username, password)
	{
		$cookies.username = username;
		$cookies.password = password;
	}

	function logout()
	{
		$cookieStore.remove("username");
		$cookiesStore.remove("password");
	}

	function getData()
	{
		return $cookies.username;
	}

})