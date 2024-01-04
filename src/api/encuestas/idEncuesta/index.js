import { API } from "../../api";
import endpointsIdEncuestaRespuestas from "./respuestas"

export const get = async (redux, abortController, idEncuesta) => {
    const respuesta = await API.llamada(redux, abortController, 'get', `/encuestas/${idEncuesta}`);
    const json = await respuesta.json();
    if (respuesta.status === 200) return json;
    throw json;
}


const encuentas_idEncuesta = {
    get,
    respuestas: endpointsIdEncuestaRespuestas
};

export default encuentas_idEncuesta;