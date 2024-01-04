import { API } from "../api";

export const get = async (redux, abortController, queryParams = {}) => {

    let { texto, formato, from, limit } = queryParams
    let urlQueryParams = [];

    if (texto) urlQueryParams.push(`texto=${encodeURIComponent(texto)}`);
    if (from) urlQueryParams.push(`from=${encodeURIComponent(from)}`);
    if (limit) urlQueryParams.push(`limit=${encodeURIComponent(parseInt(limit) || 10)}`);
    if (formato) urlQueryParams.push(`formato=${encodeURIComponent(formato)}`);

    const respuesta = await API.llamada(redux, abortController, 'get', `/empleados/noticias?${urlQueryParams.join('&')}`);
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json;
    throw json;
}


const empleado_noticias = {
    get
}

export default empleado_noticias;