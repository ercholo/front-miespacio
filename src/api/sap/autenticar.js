import llamadaSap, { obtenerJson } from "./llamadaSap";

/*
export const autenticar = async (redux, abortController, usuario, password) => {

	let body = `user=${usuario}&pass=${password}`;
	let headers = {
		'x-user': 'app_portal',
		'x-salt': '1234',
		'x-key': '8500fba4d334ab781a52caab78f3b53d',
		'content-type': 'application/x-www-form-urlencoded'
	}

	let respuesta = await llamadaSap(redux, abortController, 'post', '/api/zhr_login_api/', body, headers);

	let json = await obtenerJson(respuesta);

	if (json.token) {
		json.name = json.name.toLowerCase();
		if (json.name.endsWith('primitiv')) json.name = json.name.substring(0, json.name.length - 8)



		return {
			jwt: json.token,
			codigo: json.pernr,
			codigoPedidos: parseInt(json.kunnr),
			almacen: json.werks_ped,
			nombre: json.name.split(',')[1].trim(),
			apellidos: json.name.split(',')[0].trim(),
			foto: json.foto
		};
	} else {
		throw json;
	}

}
*/

export const consultaDatosEmpleado = async (redux, abortController) => {

	let url = `/api/zhr_login_api_v2/refresh`;
	let respuesta = await llamadaSap(redux, abortController, 'post', url);
	let json = await obtenerJson(respuesta, 'utf-8');

	if (json.token) {
		//json.name = json.name.toLowerCase();
		return {
			//jwt: json.token,
			//codigo: json.pernr,
			codigoPedidos: parseInt(json.kunnr),
			almacen: json.werks_ped,
			//nombre: json.name.split(',')[1].trim(),
			//apellidos: json.name.split(',')[0].trim(),
			//foto: json.foto
		};
	} else {
		throw json;
	}

}
