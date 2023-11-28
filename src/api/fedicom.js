import { crearPedido } from "./fedicom/crearPedido";


const FEDICOM = function (R, A) {
	return {
		crearPedido: (pedido) => crearPedido(R, A, pedido)
	}
}


FEDICOM.generarErrorFetch = (error) => {
	if (Array.isArray(error))
		return error;
	else if (error.message)
		return [{ codigo: 'NET-001', descripcion: `No se pudo alcanzar el servidor: ${error.message}` }]
	else
		return [{ codigo: 'NET-002', descripcion: `No se pudo alcanzar el servidor: ${error}` }]
}

export default FEDICOM;
