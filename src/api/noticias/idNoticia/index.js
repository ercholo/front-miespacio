import API from "../../api";

export const get = async (redux, abortController, idNoticia, formato) => {

    let pathParams = [idNoticia];
    if (formato) pathParams.push(formato);

    const respuesta = await API.llamada(redux, abortController, 'get', `/noticias/${pathParams.join('/')}`);
    const json = await respuesta.json();
    if (respuesta.status === 200) return json;
    throw json;
}

export const put = async (redux, abortController, idNoticia, noticia) => {
    let respuesta = await API.llamada(redux, abortController, 'put', `/noticias/${idNoticia}`, noticia);
    let json = await respuesta.json();
    if (json?.id) return json;
    throw json;
}

export const del = async (redux, abortController, idNoticia) => {

    let respuesta = await API.llamada(redux, abortController, 'delete', `/noticias/${idNoticia}`,);
    let json = await respuesta.json();
    if (json?.id) return json;
    throw json;
}

const noticias_idNoticia = {
    get,
    put, 
    del
};

export default noticias_idNoticia;