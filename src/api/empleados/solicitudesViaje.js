import { API } from "../api";


export const post = async (redux, abortController, solicitudViaje) => {
    let respuesta = await API.llamada(redux, abortController, 'post', '/empleados/solicitudes-viaje', solicitudViaje);
    let json = await respuesta.json();
    if (json?.id) return json;
    throw json;
}



const empleado_solicitudesViaje = {
    post
}

export default empleado_solicitudesViaje;