import llamadaSap, { obtenerJson } from "./llamadaSap";


export const descargarNominaPdf = async (redux, abortController, mes, ano) => {

	mes = '00' + (mes + 1);
	mes = mes.substring(mes.length - 2)

	let url = `/api/zhr_nomina_api/${ano}${mes}`;

	let respuesta = await llamadaSap(redux, abortController, 'get', url);
	let json = await obtenerJson(respuesta);

	if (json?.nomina_pdf) {
		return json.nomina_pdf;
	} else {
		throw json;
	}

}
