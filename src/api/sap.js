// import { /*autenticar,*/ consultaDatosEmpleado } from "./sap/autenticar";
import { consultaAccesos } from "./sap/consultaAccesos";
import { consultaCatalogo } from "./sap/consultaCatalogo";
import { consultaVales } from "./sap/consultaVales";
import { descargarAlbaranPdf } from "./sap/descargarAlbaranPdf";
import { descargarNominaPdf } from "./sap/descargarNominaPdf";
import { consultarAnticipos, consultarHistoricoAnticipos, solicitarAnticipo } from "./sap/consultaAnticipos";
import { consultarZonas, consultarSalas, consultarReservasSala, reservarSala, consultarMisReservasSala, cancelarReservaSala } from "./sap/apiSalas";

const SAP = function (R, A) {
	return {
		// autenticar: (usuario, password) => autenticar(R, A, usuario, password),
		// consultaDatosEmpleado: () => consultaDatosEmpleado(R, A),
		consultaCatalogo: (patronBusqueda, pagina, limite) => consultaCatalogo(R, A, patronBusqueda, pagina, limite),
		consultaVales: (mes, ano, modoBusqueda) => consultaVales(R, A, mes, ano, modoBusqueda),
		descargarAlbaranPdf: (albaran) => descargarAlbaranPdf(R, A, albaran),
		descargarNominaPdf: (mes, ano) => descargarNominaPdf(R, A, mes, ano),
		// descargarRetencionPdf: (mes, ano) => descargarRetencionPdf(R, A, mes, ano),
		consultaAccesos: (fecha) => consultaAccesos(R, A, fecha),
		consultarAnticipos: () => consultarAnticipos(R, A),
		consultarHistoricoAnticipos: () => consultarHistoricoAnticipos(R, A),
		solicitarAnticipo: (anticipos, prestamos, metodoIngreso) => solicitarAnticipo(R, A, anticipos, prestamos, metodoIngreso),
		salas: {
			consultarZonas: () => consultarZonas(R, A),
			consultarSalas: (zona) => consultarSalas(R, A, zona),
			consultarReservasSala: (zona, sala) => consultarReservasSala(R, A, zona, sala),
			consultarMisReservas: () => consultarMisReservasSala(R, A),
			cancelarReserva: (idReserva) => cancelarReservaSala(R, A, idReserva),
			reservarSala: (zona, sala, inicio, fin, asunto, comentario) => reservarSala(R, A, zona, sala, inicio, fin, asunto, comentario)
		}
	}
}


SAP.generarErrorFetch = (error) => {
	if (Array.isArray(error))
		return error;
	else if (error.message)
		return [{ codigo: 'NET-001', descripcion: `No se pudo alcanzar el servidor: ${error.message}` }]
	else
		return [{ codigo: 'NET-002', descripcion: `No se pudo alcanzar el servidor: ${error}` }]
}

SAP.err2text = (error) => {
	console.error(error);
	if (!error) return 'Error desconocido (Null)';
	if (Array.isArray(error)) {
		let suberror = error[0];
		if (!suberror) return 'Error desconocido (Lista vacía)';
		if (suberror.message) return String(suberror.message);
		if (suberror.descripcion) return String(suberror.descripcion);
		return String(suberror);
	}

	if (error.message) return String(error.message);
	return String(error);
}


export default SAP;