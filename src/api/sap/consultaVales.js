import { endOfMonth, format, parse, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { redux_usuario_select_Usuario } from "../../redux/usuario/usuarioSlice";
import llamadaSap, { obtenerJson } from "./llamadaSap";


export const consultaVales = async (redux, abortController, mes, ano, modoBusqueda = 'mesNatural') => {

	let empleado = '00' + redux_usuario_select_Usuario.from(redux.getState()).codigoEmpleado;

	mes = '00' + (mes + 1);
	mes = mes.substring(mes.length - 2)

	let fechaInicial = parse(`${ano}${mes}01`, 'yyyyMMdd', new Date())
	let fechaFinal = endOfMonth(fechaInicial);

	if (modoBusqueda === 'periodoNomina') {
		fechaInicial = subMonths(fechaInicial, 1).setDate(21);
		fechaFinal = fechaFinal.setDate(20)
	}

	let url = `/api/zsf_get_order_list/find?date_ini=${format(fechaInicial, 'yyyyMMdd')}&date_end=${format(fechaFinal, 'yyyyMMdd')}&customer=${empleado}&customer_typ=2`;

	let respuesta = await llamadaSap(redux, abortController, 'get', url);
	let json = await obtenerJson(respuesta);

	if (Array.isArray(json)) {

		if (json[0]?.message) {
			if (json[0].id === 5 && json[0].message === "No se han encontrado datos")
				return [];
			throw json;
		}


		return json.map(e => {
			let fechaCreacion = parse(`${e.order_dat} ${e.order_tim}`, 'yyyy-MM-dd HH:mm:ss', new Date());
			return {
				numeroPedido: e.order,
				numeroAlbaran: e.oproforma,
				fechaHoraCreacion: format(fechaCreacion, 'dd MMMM yyyy HH:mm', { locale: es }),
				fechaCreacion: format(fechaCreacion, 'dd MMMM yyyy', { locale: es }),
				precio: Math.max(e.amount_or, e.amount_ne),
				unidades: e.unidades,
				lineas: e.lineas
			}
		}).sort((a, b) => a.numeroAlbaran < b.numeroAlbaran);
	} else {
		throw json;
	}

}
