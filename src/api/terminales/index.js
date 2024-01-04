import { API } from "../api";

export const get = async (redux, abortController) => {
    const respuesta = await API.llamada(redux, abortController, 'get', `/terminales`);
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json;
    throw json;
}


export const put = async (redux, abortController, idTerminal, idVisualTime) => {
    const respuesta = await API.llamada(redux, abortController, 'put', `/terminales/${idTerminal}/mapeo`, { idVisualTime });
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json;
    throw json;
}

export const terminales = {
    get,
    put
};
