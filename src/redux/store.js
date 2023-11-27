import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { pantallaSlice } from './pantallaSlice';
import { usuarioSlice } from './usuario/usuarioSlice';
import { gestionViajesSlice } from './gestion/viajesSlice';

import { apiSlice } from './api/apiSlice';
import { anticiposSlice } from './api/anticiposSlice';
import { catalogoSlice } from './api/catalogoSlice';
import { carritoSlice } from './api/carritoSlice';
import { valesSlice } from './api/valesSlice';
import { descargaAlbaranPdfSlice } from './api/albaranPdfSlice';
import { accesosSlice } from './api/accesosSlice';
import { ticketsSlice } from './tickets/ticketsSlice';
import salasReducer from './api/salas/salasSlice';
import { noticiasGestionSlice } from './api/noticiasGestion/noticiasGestionSlice';
import { noticiasSlice } from './api/noticias/noticiasSlice';
import { maestroAsignacionesSlice } from './api/maestroAsignaciones/maestroAsignacionesSlice';

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
		salas: salasReducer,
		noticiasGestion: noticiasGestionSlice.reducer,
		noticias: noticiasSlice.reducer,
		maestroAsignaciones: maestroAsignacionesSlice.reducer,
	}
});

