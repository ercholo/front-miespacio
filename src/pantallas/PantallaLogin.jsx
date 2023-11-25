import React from "react";

import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { redux_usuario_inicializar, redux_usuario_select_EstadoInicializacion } from "../redux/usuario/usuarioSlice";
import { BoxErrorApi } from "../navegacion/BoxErrorApi";
import { BoxCargando } from "../navegacion/BoxCargando";




export default function PantallaLogin() {


	const dispatch = useDispatch();
	const estadoLogin = useSelector(redux_usuario_select_EstadoInicializacion);



	const [cookies] = useCookies(['empleado_sessid']);

	React.useEffect(() => {
		switch (estadoLogin.estado) {
			case 'inicial':
			case 'logout':
				dispatch(redux_usuario_inicializar({ token: cookies.empleado_sessid }))
				return;
			case 'needLogin':
				window.location.href = '/ssf/login';
				return;
			default:
				return;

		}
	}, [dispatch, estadoLogin, cookies.empleado_sessid])

	if (estadoLogin.estado ==='error' && estadoLogin.error) {

		return <BoxErrorApi msError={estadoLogin.error} titulo="Ocurrió un error durante el login" />
	}
	return <BoxCargando titulo="Estás siendo redirigido a SuccessFactors para identificarte"/>;
}