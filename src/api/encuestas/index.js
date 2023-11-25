import API from "../api";
import endpointsIdEncuesta from "./idEncuesta"

export const get = async (redux, abortController) => {
    const respuesta = await API.llamada(redux, abortController, 'get', `/encuestas`);
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json;
    throw json;
}

const encuestas = {
    get,
    idEncuesta: endpointsIdEncuesta
};

export default encuestas;