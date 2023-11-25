import { isBefore, subMinutes } from "date-fns";
import React from "react";



export default function useFormularioReservaSala(fecha, tramos, duracionTramo=30) {

	// TODO: Si no hay tramo decente para hoy, nos vamos a mañana.
	const primerTramoDecenteDisponible = React.useMemo(() => {
		let primeraHoraDecente = subMinutes(tramos[0].fecha, 1);
		let tramo = tramos.find(t => t.disponible && isBefore(primeraHoraDecente, t.fecha));
		if (!tramo) tramo = tramos.find(t => t.disponible);
		return tramo;
	}, [tramos])
	
	const [seleccionHora, setSeleccionHora] = React.useState({
		tramo: primerTramoDecenteDisponible,
		duracion: Math.min(primerTramoDecenteDisponible?.duracionMax, 60)
	});

	const setHora = React.useCallback((hora) => {
		let tramo = tramos.find(t => t.valor === hora);
		setSeleccionHora(s => {
			return { tramo, duracion: Math.min(tramo.duracionMax, s.duracion) }
		})
	}, [tramos, setSeleccionHora]);

	const setDuracion = React.useCallback((duracion) => {
		setSeleccionHora(s => {
			return {
				tramo: s.tramo,
				duracion: Math.min(s.tramo.duracionMax, duracion)
			}
		})
	}, [setSeleccionHora]);

	const duracionesDisponibles = React.useMemo(() => {
		let resultado = [];
		let duracion = duracionTramo;
		do {
			resultado.push(duracion);
			duracion += duracionTramo
		} while (duracion <= seleccionHora.tramo.duracionMax);
		return resultado;
	}, [duracionTramo, seleccionHora.tramo]);

	const [asunto, setAsunto] = React.useState('');
	const [comentario, setComentario] = React.useState('');
	const [diaCompleto, setDiaCompleto] = React.useState(false);


	
	React.useEffect(() => {
		if (!primerTramoDecenteDisponible) return;
		setSeleccionHora({
			tramo: primerTramoDecenteDisponible,
			duracion: Math.min(primerTramoDecenteDisponible.duracionMax, 60)
		})
	}, [fecha, primerTramoDecenteDisponible, setSeleccionHora])

	return {
		asunto, setAsunto,
		comentario, setComentario,
		diaCompleto, setDiaCompleto,
		hora: seleccionHora.tramo.fecha, setHora,
		duracion: seleccionHora.duracion, setDuracion,
		duracionesDisponibles,
		primerTramoDecenteDisponible
	}
}