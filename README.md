# front-tuespacio
Frontend de la aplicación web "Tu Espacio" de RRHH


# Despliegue desarrollo 
Para poner en marcha el entorno de desarrollo, es necesario tener instalado el runtime de Node.JS, en versión 18.x.
Para editar, recomendado uso Visual Studio Code con la extensión de `GitHub Pull Request`.
Para la depuración del código, es muy recomendable tener el plugin `Redux DevTools` de Chrome. 

```
git config --global user.name "Tu Nombre" 
git config --global user.email "tu.correo@hefame.es" 
```

Instalación en local y poner a funcionar el proyecto con: 

```
git clone https://github.com/Hefame/front-tuespacio 
cd front-tuespacio 
npm install 
npm run start 
```
 
Esto abrirá el navegador con la web de inicio http://localhost:3000. 


## Login en desarrollo 
Por temas del SSO, no es posible realizar la autenticación normal en este entorno de desarrollo. 
En el futuro inventaremos alguna manera mejor, pero por o pronto, para hacer login: 
- Iniciaremos sesión en el portal productivo, https://empleado.hefame.es.
- Abriremos las `Redux DevTools` y obtendremos nuestro token en `usuario > tokens > api`.
- Nos moveremos a http://localhost:3000/logout 
- Abrimos consola y ejecutamos la función `window.haztelaNegra('token')`
- Nos moveremos a http://localhost:3000, ya estaremos logeados. 

 