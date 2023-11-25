import API from "../api";
import endpointsIdAsignacion from "./idAsignacion"

export const get = async (redux, abortController) => {
    const respuesta = await API.llamada(redux, abortController, 'get', `/asignaciones`);
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json;
    throw json;
}


const asignaciones = {
    get,
    idAsignacion: endpointsIdAsignacion
};

export default asignaciones;