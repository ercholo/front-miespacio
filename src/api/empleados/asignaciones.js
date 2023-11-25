import API from "../api";

export const get = async (redux, abortController) => {
    const respuesta = await API.llamada(redux, abortController, 'get', '/empleados/asignaciones');
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json; 
    throw json;
}


const empleado_asignaciones = {
    get
}

export default empleado_asignaciones;