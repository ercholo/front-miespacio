import { format } from "date-fns";
import { es } from "date-fns/locale";
import llamadaSap, { obtenerJson } from "./llamadaSap";


export const consultaAccesos = async (redux, abortController, fecha) => {

	let fechaFormateada = format(fecha, 'yyyyMMdd', { locale: es });
	let url = `/api/zhr_datos_accesos/${fechaFormateada}`;

	let respuesta = await llamadaSap(redux, abortController, 'get', url);
	let json = await obtenerJson(respuesta, 'utf-8');

	if (Array.isArray(json)) {
		return json.map(e => {
			return {
				entrada: e.hora_entrada,
				salida: e.hora_salida,
				motivo: e.motivo ? parseInt(e.motivo) : null,
				dispositivo: e.punto,
				lugar: e.nombre_dispo
			}
		}).sort((a, b) => a.numeroAlbaran < b.numeroAlbaran);
	} else {
		throw json;
	}

}
