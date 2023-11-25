import API from "../../api";

export const get = async (redux, abortController, idVehiculo) => {
    const respuesta = await API.llamada(redux, abortController, 'get', `/vehiculos/${idVehiculo}`);
    const json = await respuesta.json();
    if (respuesta.status === 200) return json;
    throw json;
}

const vehiculos_idVehiculo =  {
    get
}

export default vehiculos_idVehiculo;