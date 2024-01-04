import { API } from "../api";
import endpointsIdNoticia from "./idNoticia"

export const get = async (redux, abortController, queryParams = {}) => {

    let { texto, formato, from, limit } = queryParams

    let urlQueryParams = [];
    if (texto) urlQueryParams.push(`texto=${encodeURIComponent(texto)}`);
    if (from) urlQueryParams.push(`from=${encodeURIComponent(from)}`);
    if (limit) urlQueryParams.push(`limit=${encodeURIComponent(parseInt(limit) || 10)}`);
    if (formato) urlQueryParams.push(`formato=${encodeURIComponent(formato)}`);

    const respuesta = await API.llamada(redux, abortController, 'get', `/noticias?${urlQueryParams.join('&')}`);
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json;
    throw json;
}


export const post = async (redux, abortController, noticia) => {
    let respuesta = await API.llamada(redux, abortController, 'post', '/noticias', noticia);
    let json = await respuesta.json();
    if (json?.id) return json;
    throw json;
}


export const noticias = {
    get,
    post,
    idNoticia: endpointsIdNoticia
};

