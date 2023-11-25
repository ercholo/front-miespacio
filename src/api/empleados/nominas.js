import MsRestError from "@hefame/microservice-rest-error";
import API from "../api";

export const get = async (redux, abortController, ano, mes) => {
    const respuesta = await API.llamada(redux, abortController, 'get', `/empleados/nominas/${ano}/${mes}`);

    if (respuesta.status === 200) {
        const buffer = await respuesta.blob()
        return buffer;
    }

    const json = await respuesta.json();
    throw MsRestError.from(json);
}


const empleado_nominas = {
    get
}

export default empleado_nominas;