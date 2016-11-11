routes = ['/',
 '/decimar',
 '/favicon.ico',
 '/file/original/cube.obj',
 '/file/original/dancer03.obj',
 '/file/original/ford_f150_final.obj',
 '/file/original/statue.obj',
 '/javascripts/controllersApp.js',
 '/javascripts/directiveR.js',
 '/javascripts/moduleApp.js',
 '/javascripts/servicesApp.js',
 '/login',
 '/pages/renderPost.html',
 '/pages/renderPrev.html',
 '/principal',
 '/signout',
 '/stylesheets/principal.css',
 '/stylesheets/signin-singup-style.css',
 '/stylesheets/style.css',
 '/upload',
 '/user/files']


url = "http://localhost:3000"

from requests import get
from requests import post
import thread
import time


def peticion(url, route):
	post(str(url) + str (route))
	get(str(url) + str (route))


i = 0
while True:
	if i == 2000:
		i = 0
	if i % 800 == 0:
		time.sleep(1) # Dos segundos

	route = routes[i % len(routes)]
	try:
		thread.start_new_thread( peticion, (url, route, ) )
	except Exception as e:
		pass

	i += 1