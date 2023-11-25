import API from "../api";
import endpointsIdVehiculo from "./idVehiculo"

export const get = async (redux, abortController) => {
    const respuesta = await API.llamada(redux, abortController, 'get', `/vehiculos`);
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json;
    throw json;
}

const vehiculos = {
    get,
    idVehiculo: endpointsIdVehiculo
};

export default vehiculos;