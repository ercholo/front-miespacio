import { API } from "../api";


const BASE_URL = '/empleados/tickets-soporte'

export const post = async (redux, abortController, ticketSoporte) => {

    let respuesta = await API.llamada(redux, abortController, 'post', BASE_URL, ticketSoporte);
    let json = await respuesta.json();
    if (json?.id) return json;
    throw json;
}

export const get = async (redux, abortController) => {
    const respuesta = await API.llamada(redux, abortController, 'get', BASE_URL);
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json;
    throw json;
}



const empleado_ticketsSoporte = {
    get, post
}

export default empleado_ticketsSoporte;