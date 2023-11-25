import llamadaSap, { obtenerJson } from "./llamadaSap";


export const descargarRetencionPdf = async (redux, abortController, ano) => {

	let url = `/api/zhr_cert_retencion_api/${ano}`;

	let respuesta = await llamadaSap(redux, abortController, 'get', url);
	let json = await obtenerJson(respuesta);

	if (json?.pdf_file) {
		return json.pdf_file;
	} else {
		if (json.pdf_file === '') throw new Error('No se pudo generar el documento')
		throw JSON.stringify(json);
	}

}
