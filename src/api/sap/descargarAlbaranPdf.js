import llamadaSap, { obtenerJson } from "./llamadaSap";


export const descargarAlbaranPdf = async (redux, abortController, albaran) => {

	albaran = '0000000000' + albaran;
	albaran = albaran.substring(albaran.length - 10)

	let url = `/api/zsf_get_document/proforma/${albaran}`;

	let respuesta = await llamadaSap(redux, abortController, 'get', url);

	let json = await obtenerJson(respuesta);

	if (json[0]?.pdf_file) {
		return json[0].pdf_file;
	} else {
		throw json;
	}

}
