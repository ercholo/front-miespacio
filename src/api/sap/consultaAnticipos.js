import { parse } from "date-fns";
import llamadaSap, { obtenerJson } from "./llamadaSap";

const tipo2Nombre = (tipo) => {
	switch (parseInt(tipo)) {
		case 9403: return 'Nómina del mes';
		case 9423: return 'Extra de Beneficios';
		case 9433: return 'Extra de Verano';
		case 9443: return 'Extra de Navidad';
		case 9800: return 'Préstamo de empresa';
		default: return 'Desconocido'
	}
}


export const consultarAnticipos = async (redux, abortController) => {

	let url = `/api/zhr_anticipos_api`;

	let respuesta = await llamadaSap(redux, abortController, 'get', url);
	let json = await obtenerJson(respuesta);

	if (json.t_anticipos) {

		let anticipos = json.t_anticipos.map(anticipo => {
			return {
				codigo: anticipo.tipo,
				nombre: tipo2Nombre(anticipo.tipo),
				disponible: parseFloat(anticipo.disponible),
				concedido: parseFloat(anticipo.concedido),
				pendienteAprobar: parseFloat(anticipo.pendiente_val)
			}
		})

		let prestamos = json.t_prestamo.map(prestamo => {
			return {
				codigo: prestamo.tipo,
				nombre: tipo2Nombre(prestamo.tipo),
				disponible: parseFloat(prestamo.disponible),
				concedido: parseFloat(prestamo.concedido),
				pendienteAprobar: parseFloat(prestamo.pendiente_val),
				pendientePagar: parseFloat(prestamo.pendiente_pagar),
				cuota: parseFloat(prestamo.cuota),
				fechaInicio: prestamo.fecha_ini !== '00000000' ? prestamo.fecha_ini : null,
				fechaFin: prestamo.fecha_fin !== '00000000' ? prestamo.fecha_fin : null,
			}
		})

		return {
			anticipos,
			prestamos
		};
	} else {
		throw json;
	}

}


export const consultarHistoricoAnticipos = async (redux, abortController) => {

	let url = `/api/zhr_anticipos_api/historico`;

	let respuesta = await llamadaSap(redux, abortController, 'get', url);
	let json = await obtenerJson(respuesta);

	if (Array.isArray(json)) {

		return json.map(e => {
			return {
				fecha: e.fecha,
				estado: e.status === 'A' ? 'aprobado' : (e.status === 'R' ? 'rechazado' : 'pendiente'),
				pago: e.pago,
				comentarios: e.comenta,
				cantidades: {
					nominames: parseFloat(e.ant1_imp) || undefined,
					beneficios: parseFloat(e.ant2_imp) || undefined,
					verano: parseFloat(e.ant3_imp) || undefined,
					navidad: parseFloat(e.ant4_imp) || undefined,
					prestamo: parseFloat(e.antic_imp) || undefined,
					credito: parseFloat(e.credit_imp) || undefined,
				}
			}
		}).sort((a, b) => (parse(b.fecha, 'yyyyMMdd', new Date())).getTime() - (parse(a.fecha, 'yyyyMMdd', new Date())).getTime())

	} else {
		throw json;
	}

}

export const solicitarAnticipo = async (redux, abortController, anticipos, prestamos, metodoIngreso) => {


	anticipos = Object.values(anticipos).filter(a => a.solicitado > 0)
	prestamos = Object.values(prestamos).filter(p => p.solicitado > 0)

	let body = {
		"t_anticipos": anticipos.map(a => {
			return {
				tipo: a.codigo,
				importe: a.solicitado
			}
		}),
		"t_prestamo": prestamos.map(p => {
			return {
				tipo: p.codigo,
				importe: p.solicitado,
				cuota: p.cuotas
			}
		}),
		"destino": metodoIngreso
	}

	let url = `/api/zhr_anticipos_api`;

	let respuesta = await llamadaSap(redux, abortController, 'post', url, JSON.stringify(body));
	let json = await obtenerJson(respuesta);

	if (json.status === "04") {
		return true;
	} else {
		throw new Error(json.message || 'No se pudo grabar la solicitud')
	}

}