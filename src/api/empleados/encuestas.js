import API from "../api";

export const get = async (redux, abortController, idEncuesta) => {
    const respuesta = await API.llamada(redux, abortController, 'get', `/empleados/encuestas/${idEncuesta}`);
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json; 
    throw json;
}


export const post = async (redux, abortController, idEncuesta, contestacion) => {
    const respuesta = await API.llamada(redux, abortController, 'post', `/empleados/encuestas/${idEncuesta}`, contestacion);
    const json = await respuesta.json();
    if (respuesta.status === 200)
        return json; 
    throw json;
}

const empleado_asignaciones = {
    get, post
}

export default empleado_asignaciones;