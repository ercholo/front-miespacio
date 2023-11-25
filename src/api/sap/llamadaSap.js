import { redux_usuario_select_Tokens } from "./../../redux/usuario/usuarioSlice";

export default async function llamadasSap(redux, abortController, metodo, url, body, cabeceras) {

	let urlSap = redux.getState().api.urlBase;
	let tokens = redux_usuario_select_Tokens.from(redux.getState());
	let jwt = tokens?.sap || null;

	if (!cabeceras) cabeceras = {}
	let opciones = {
		method: metodo,
		headers: {
			...cabeceras
		},
		encoding: 'latin1',
	}

	if (abortController) opciones.signal = abortController.signal;
	if (body) opciones.body = body;
	if (jwt) opciones.headers['x-token'] = jwt;


	console.groupCollapsed(opciones.method.toUpperCase() + ' ' + urlSap + url);
	console.log(opciones.headers)
	if (body) console.log(body)
	console.groupEnd()

	//return await new Promise(resolve => setTimeout(() => resolve(fetch(urlFedicom + url, opciones)), 100));
	return fetch(urlSap + url, opciones);

}


export async function obtenerJson(respuesta, encoding = 'iso-8859-1') {
	const buffer = await respuesta.arrayBuffer();
	const decoder = new TextDecoder(encoding);
	const texto = decoder.decode(buffer)

	return JSON.parse(texto);
}




//export default llamadaSap;