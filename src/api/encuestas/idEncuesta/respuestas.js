import { API } from "../../api";

export const get = async (redux, abortController, idEncuesta) => {
    const respuesta = await API.llamada(redux, abortController, 'get', `/encuestas/${idEncuesta}/respuestas`);
    const json = await respuesta.json();
    if (respuesta.status === 200) return json;
    throw json;
}


const encuentas_idEncuesta_respuestas = {
    get
};

export default encuentas_idEncuesta_respuestas;