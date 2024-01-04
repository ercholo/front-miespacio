import { useEffect } from "react";

import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { redux_usuario_inicializar, redux_usuario_select_EstadoInicializacion } from "../redux/usuario/usuarioSlice";
import { BoxErrorApi, BoxCargando } from "../navegacion/";

export const PantallaLogin = () => {

	const dispatch = useDispatch();
	const estadoLogin = useSelector(redux_usuario_select_EstadoInicializacion);
	console.log(estadoLogin)

	const [cookies] = useCookies(['empleado_sessid']);

	useEffect(() => {
		switch (estadoLogin.estado) {
			//Si el caso es 'inicial' o logout se hace lo mismo.
			case 'inicial':
			case 'logout':
				console.log(cookies.empleado_sessid)
				dispatch(redux_usuario_inicializar({ token: cookies.empleado_sessid }))
				return;
			case 'needLogin':
				//Voy a dejarlo en /logout para que no intente loguearse
				// window.location.href = '/ssf/login';
				window.location.href = '/logout';
				return;
			default:
				return;

		}
	}, [dispatch, estadoLogin, cookies.empleado_sessid])

	if (estadoLogin.estado === 'error' && estadoLogin.error) {

		return (
			<BoxErrorApi msError={estadoLogin.error} titulo="Ocurrió un error durante el login" />
		)
	}
	return (
		<BoxCargando titulo="Estás siendo redirigido a SuccessFactors para identificarte" />
	)
}
