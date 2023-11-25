import { combineReducers, configureStore } from '@reduxjs/toolkit';

import pantallaReducer from './pantallaSlice';
import usuarioReducer from './usuario/usuarioSlice';
import gestionViajesReducer from './gestion/viajesSlice';



import apiReducer from './api/apiSlice';
import anticiposReducer from './api/anticiposSlice';
import catalogoReducer from './api/catalogoSlice';
import carritoReducer from './api/carritoSlice';
import valesReducer from './api/valesSlice';
import albaranPdfReducer from './api/albaranPdfSlice';
import accesosReducer from './api/accesosSlice';
import ticketsReducer from './tickets/ticketsSlice';
import salasReducer from './api/salas/salasSlice';
import noticiasGestionReducer from './api/noticiasGestion/noticiasGestionSlice';
import noticiasReducer from './api/noticias/noticiasSlice';
import maestroAsignacionesReducer from './api/maestroAsignaciones/maestroAsignacionesSlice';


window.haztelaNegra = (token) => {

	function setCookie(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	setCookie('empleado_sessid', token, 1);
	console.log('yipi');

}


export const store = configureStore({
	reducer: {
		usuario: usuarioReducer,
		gestion: combineReducers({
			viajes: gestionViajesReducer
		}),
		api: apiReducer,
		catalogo: catalogoReducer,
		carrito: carritoReducer,
		vales: valesReducer,
		albaranPdf: albaranPdfReducer,
		pantalla: pantallaReducer,
		accesos: accesosReducer,
		tickets: ticketsReducer,
		anticipos: anticiposReducer,
		salas: salasReducer,
		noticiasGestion: noticiasGestionReducer,
		noticias: noticiasReducer,
		maestroAsignaciones: maestroAsignacionesReducer,
	}
});

