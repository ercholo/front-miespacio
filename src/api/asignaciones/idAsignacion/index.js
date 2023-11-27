import API from "../../api";

export const get = async (redux, abortController, idAsignacion) => {
    const respuesta = await API.llamada(redux, abortController, 'get', `/asignaciones/${idAsignacion}`);
    const json = await respuesta.json();
    console.log(json)
    if (respuesta.status === 200) return json;
    throw json;
}

const asignaciones_idAsignacion =  {
    get
}

export default asignaciones_idAsignacion;