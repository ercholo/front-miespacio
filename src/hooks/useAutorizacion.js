import React from "react";
import { useSelector } from "react-redux";
import { redux_usuario_select_Asignaciones } from "./../redux/usuario/usuarioSlice";




export default function useAutorizacion( permisos ) {

	const asignaciones = useSelector(redux_usuario_select_Asignaciones);
	const autorizado = React.useMemo(() => {
		if (!permisos) return true;

		for (let tipoPermiso in permisos) {
			if (permisos[tipoPermiso].includes(asignaciones[tipoPermiso])) return true;	
		}
		return false;
	}, [asignaciones, permisos]);
	return autorizado;
	
}