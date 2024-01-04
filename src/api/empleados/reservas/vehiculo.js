import { API } from "../../api";

export const get = async (redux, abortController, queryParams = {}) => {

    let { desde, hasta } = queryParams
    let urlQueryParams = [];

    if (desde) urlQueryParams.push(`desde=${encodeURIComponent(desde.toISOString())}`);
    if (hasta) urlQueryParams.push(`hasta=${encodeURIComponent(hasta.toISOString())}`);

    const respuesta = await API.llamada(redux, abortController, 'get', `/empleados/reservas/vehiculo?${urlQueryParams.join('&')}`);
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json;
    throw json;
}


export const post = async (redux, abortController, reserva) => {
    const respuesta = await API.llamada(redux, abortController, 'post', '/empleados/reservas/vehiculo', reserva);
    const json = await respuesta.json();
    if (json?.id) return json;
    throw json;
}


export const del = async (redux, abortController, idReserva) => {
    const respuesta = await API.llamada(redux, abortController, 'delete', `/empleados/reservas/vehiculo/${idReserva}`);
    const json = await respuesta.json();
    if (json?.id) return json;
    throw json;
}




const empleado_reservas_vehiculo = {
    get,
    post,
    idReserva: {
        del
    }
}

export default empleado_reservas_vehiculo;