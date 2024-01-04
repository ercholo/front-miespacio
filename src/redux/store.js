import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { pantallaSlice } from './pantallaSlice';
import { usuarioSlice } from './usuario/usuarioSlice';
import { gestionViajesSlice } from './gestion/viajesSlice';

import { apiSlice, anticiposSlice, catalogoSlice, carritoSlice, valesSlice, descargaAlbaranPdfSlice, accesosSlice } from './api/';
import { ticketsSlice } from './tickets/ticketsSlice';
import { maestroAsignacionesSlice } from './api/maestroAsignaciones/maestroAsignacionesSlice';
import { noticiasGestionSlice } from './api/noticiasGestion/noticiasGestionSlice';
import { noticiasSlice } from './api/noticias/noticiasSlice';
import { salasSlice } from './api/salas/salasSlice';

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
		usuario: usuarioSlice.reducer,
		gestion: combineReducers({
			viajes: gestionViajesSlice.reducer
		}),
		api: apiSlice.reducer,
		catalogo: catalogoSlice.reducer,
		carrito: carritoSlice.reducer,
		vales: valesSlice.reducer,
		albaranPdf: descargaAlbaranPdfSlice.reducer,
		pantalla: pantallaSlice.reducer,
		accesos: accesosSlice.reducer,
		tickets: ticketsSlice.reducer,
		anticipos: anticiposSlice.reducer,
		salas: salasSlice.reducer,
		noticiasGestion: noticiasGestionSlice.reducer,
		noticias: noticiasSlice.reducer,
		maestroAsignaciones: maestroAsignacionesSlice.reducer,
	}
});