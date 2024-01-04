import MsRestError from "@hefame/microservice-rest-error";
import { redux_usuario_select_Tokens } from "../redux/usuario/usuarioSlice";

import { empleados } from "./empleados";
import { noticias } from "./noticias";
import { asignaciones } from "./asignaciones";
import { vehiculos } from "./vehiculos";
import { terminales } from "./terminales";
import { encuestas } from "./encuestas";

export const API = function (R, A) {

	return {
		empleados: {
			ticketsSoporte: {
				get: () => empleados.ticketsSoporte.get(R, A),
				post: (ticketSoporte) => empleados.ticketsSoporte.post(R, A, ticketSoporte),
			},
			asignaciones: {
				get: () => empleados.asignaciones.get(R, A),
			},
			solicitudesViaje: {
				post: (solicitudViaje) => empleados.solicitudesViaje.post(R, A, solicitudViaje),
			},
			noticias: {
				get: (texto, from, limit) => empleados.noticias.get(R, A, texto, from, limit),
			},
			reservas: {
				vehiculo: {
					get: (queryParams) => empleados.reservas.vehiculo.get(R, A, queryParams),
					post: (reserva) => empleados.reservas.vehiculo.post(R, A, reserva),
					idReserva: {
						del: (idReserva) => empleados.reservas.vehiculo.idReserva.del(R, A, idReserva),
					},
				},
			},
			retenciones: {
				get: (ano) => empleados.retenciones.get(R, A, ano),
			},
			nominas: {
				get: (ano, mes) => empleados.nominas.get(R, A, ano, mes),
			},
			encuestas: {
				get: (idEncuesta) => empleados.encuestas.get(R, A, idEncuesta),
				post: (idEncuesta, contestacion) => empleados.encuestas.post(R, A, idEncuesta, contestacion),
			},
		},
		encuestas: {
			get: () => encuestas.get(R, A),
			idEncuesta: {
				get: (idEncuesta) => encuestas.idEncuesta.get(R, A, idEncuesta),
				respuestas: {
					get: (idEncuesta) => encuestas.idEncuesta.respuestas.get(R, A, idEncuesta),
				},
			},
		},
		noticias: {
			get: (query) => noticias.get(R, A, query),
			post: (noticia) => noticias.post(R, A, noticia),
			idNoticia: {
				get: (idNoticia, formato) => noticias.idNoticia.get(R, A, idNoticia, formato),
				put: (idNoticia, noticia) => noticias.idNoticia.put(R, A, idNoticia, noticia),
				del: (idNoticia) => noticias.idNoticia.del(R, A, idNoticia),
			},
		},
		asignaciones: {
			get: () => asignaciones.get(R, A),
			idAsignacion: {
				get: (idAsignacion) => asignaciones.idAsignacion.get(R, A, idAsignacion),
			},
		},
		vehiculos: {
			get: () => vehiculos.get(R, A),
			idVehiculo: {
				get: (idVehiculo) => vehiculos.idVehiculo.get(R, A, idVehiculo),
			},
		},
		terminales: {
			get: () => terminales.get(R, A),
			put: (idTerminal, idVisualTime) => terminales.put(R, A, idTerminal, idVisualTime),
		},
	};
};

API.llamada = async (redux, abortController, metodo, urlPath, body, cabeceras) => {
	let url = `https://empleado.hefame.es/rest/v1${urlPath}`;
	let jwt = redux_usuario_select_Tokens.from(redux.getState()).api;


	if (!cabeceras) cabeceras = {};
	let opciones = {
		method: metodo,
		headers: {
			...cabeceras,
			"content-type": "application/json",
		},
	};

	if (abortController) opciones.signal = abortController.signal;
	if (body) opciones.body = JSON.stringify(body);
	if (jwt) opciones.headers["Authorization"] = "Bearer " + jwt;

	console.log(opciones)

	console.groupCollapsed(opciones.method.toUpperCase() + " " + url);
	if (body) console.log(body);
	console.groupEnd();

	try {
		return await fetch(url, opciones);
	} catch (error) {
		if (abortController.signal.aborted) {
			console.error('Error:', error.message);
		}
		throw sanearTipoError(error).toJSON();
	}
};

const sanearTipoError = (error) => {
	if (Array.isArray(error?.errores)) return MsRestError.from(error);
	else if (error.message) return new MsRestError("NETWORK_ERROR", error.message, "API_CALL");
	else return new MsRestError("NETWORK_ERROR", String(error), "API_CALL");
};

