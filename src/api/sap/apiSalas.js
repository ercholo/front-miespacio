import { format, parse } from "date-fns";
import llamadaSap, { obtenerJson } from "./llamadaSap";


export const consultarZonas = async (redux, abortController) => {
	let url = `/api/zhr_reservas_api/salas`;

	let respuesta = await llamadaSap(redux, abortController, 'get', url);
	let json = await obtenerJson(respuesta, 'utf-8');

	if (Array.isArray(json)) {

		if (json[0]?.message) {
			throw json;
		}

		return json.map(e => {
			return {
				codigo: e.izone,
				nombre: e.descr
			}
		});
	} else {
		throw json;
	}
}

export const consultarSalas = async (redux, abortController, zona) => {

	let url = `/api/zhr_reservas_api/salas/${zona}`;
	let respuesta = await llamadaSap(redux, abortController, 'get', url);
	let json = await obtenerJson(respuesta, 'utf-8');

	if (Array.isArray(json.s_rooms)) {
		return json.s_rooms.map(e => {
			return {
				codigo: e.iroom,
				codigoZona: json.izone,
				nombre: e.descr,
				nombreZona: json.descr,
				mensaje: e.messg,
				aforo: parseInt(e.capac, 10),
				medios: e.media
			}
		});
	} else {
		throw json;
	}
}

export const consultarReservasSala = async (redux, abortController, zona, sala) => {
	let url = `/api/zhr_reservas_api/salas/${zona}/${sala}`;
	let respuesta = await llamadaSap(redux, abortController, 'get', url);
	let json = await obtenerJson(respuesta, 'utf-8');

	if (Array.isArray(json.t_reserv)) {
		let fechaRef = new Date();
		return json.t_reserv.map(e => {
			return {
				id: e.idrsv,
				empleado: e.ename,
				asunto: e.title,
				comentario: e.descr,
				inicio: parse(e.begda + e.beguz, 'yyyyMMddHHmmSS', fechaRef).toString(),
				fin: parse(e.endda + e.enduz, 'yyyyMMddHHmmSS', fechaRef).toString()
			}
		});
	} else {
		throw json;
	}
}

export const reservarSala = async (redux, abortController, zona, sala, inicio, fin, asunto, comentario) => {

	inicio = new Date(inicio);
	fin = new Date(fin);
	let body = {
		tittle: asunto.replace(/[`'&"\\]/gi, ''),
		description: comentario.replace(/[`'&"\\]/gi, ''),
		fecha_inicio: format(inicio, 'yyyyMMdd'),
		hora_inicio: format(inicio, 'HHmmss'),
		fecha_fin: format(fin, 'yyyyMMdd'),
		hora_fin: format(fin, 'HHmmss'),
	}

	let url = `/api/zhr_reservas_api/salas/${zona}/${sala}`;

	let respuesta = await llamadaSap(redux, abortController, 'post', url, JSON.stringify(body));
	let json = await obtenerJson(respuesta);

	if (json.id) {
		if (json.id === "00000000000") {
			throw new Error('No se pudo realizar la reserva')
		}
		return json.id;
	} else {
		throw json;
	}
}

export const consultarMisReservasSala = async (redux, abortController) => {

	let url = `/api/zhr_reservas_api/salas/mis-reservas`;
	let respuesta = await llamadaSap(redux, abortController, 'get', url);
	let json = await obtenerJson(respuesta, 'utf-8');

	if (Array.isArray(json)) {
		let fechaRef = new Date();
		return json.map(e => {
			return {
				id: e.idrsv,
				codigoZona: e.izone,
				zona: e.izone_descr,
				codigoSala: e.iroom,
				sala: e.iroom_descr,
				asunto: e.title,
				comentario: e.descr,
				inicio: parse(e.begda + e.beguz, 'yyyyMMddHHmmSS', fechaRef).toString(),
				fin: parse(e.endda + e.enduz, 'yyyyMMddHHmmSS', fechaRef).toString()
			}
		});
	} else {
		throw json;
	}
}

export const cancelarReservaSala = async (redux, abortController, idReserva) => {

	let url = `/api/zhr_reservas_api/salas/${parseInt(idReserva, 10)}`;
	let respuesta = await llamadaSap(redux, abortController, 'delete', url);
	let json = await obtenerJson(respuesta);

	if (json.result === 'X') {
		return idReserva
	} else {
		return false;
	}
}