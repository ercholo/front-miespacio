import { useState, useCallback, useRef, useContext, useEffect } from "react";
import { API } from "../api/api";
import { useStore } from 'react-redux';

import { addDays } from 'date-fns';
import { AbortContext } from "../context/AbortContext";


const TOMORROW = addDays(new Date(), 3); // hace que se pueda seleccionar el mes que viene 3 días antes de que llegue
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MES = TOMORROW.getMonth() - 1 < 0 ? 11 : TOMORROW.getMonth() - 1;
const ANO = TOMORROW.getMonth() - 1 < 0 ? TOMORROW.getFullYear() - 1 : TOMORROW.getFullYear();
const ANOS = []; for (let i = 10; i >= 0; i--) ANOS.push(ANO - i);

export const useNominas = () => {
	
	const { abortController, createAbortController } = useContext(AbortContext);

	useEffect(
		() => {
			createAbortController();
		}, [createAbortController]
	)


	const redux = useStore();

	const [fecha, _setFecha] = useState({ mes: MES, ano: ANO });
	const setMes = useCallback((e) => {
		_setFecha(f => {
			return {
				ano: f.ano,
				mes: e.target.value
			}
		});
	}, [_setFecha]);
	const setAno = useCallback((e) => {
		_setFecha(f => {
			return {
				ano: e.target.value,
				mes: (e.target.value === ANO && f.mes > MES ? MES : f.mes)
			}
		});
	}, [_setFecha]);
	const mesesDisponibles = fecha.ano === ANO ? MESES.slice(0, MES + 1) : [...MESES];

	const [visualizarNomina, setVisualizarNomina] = useState(false);
	const refDescargaPdf = useRef();
	const [qNomina, setQnomina] = useState({
		estado: 'inicial',
		error: null,
		pdf: null
	});

	const fnDescargarPdf = useCallback(async (opciones = { visualizar: false }) => {

		const { visualizar } = opciones;
		setQnomina({ estado: 'cargando', error: null })
		try {
			let mes = ('0' + (fecha.mes + 1)).slice(-2);
			const respuestaApi = await API(redux, abortController).empleados.nominas.get(fecha.ano, mes);
			setQnomina({ estado: 'completado', error: null, pdf: respuestaApi })
			setVisualizarNomina(Boolean(opciones.visualizar));

			if (!visualizar) {
				const href = window.URL.createObjectURL(respuestaApi);
				const a = refDescargaPdf.current;
				a.download = `nomina.${mes}.${fecha.ano}.pdf`;
				a.href = href;
				a.click();
				a.href = '';
			}

		} catch (error) {
			setQnomina({ estado: 'error', error })
		}

	}, [redux, setQnomina, setVisualizarNomina, fecha, abortController])

	return {
		ano: fecha.ano,
		mes: fecha.mes,
		setAno, setMes,
		mesesDisponibles,
		fnDescargarPdf,
		qNomina,
		nomina: qNomina.pdf,
		refDescargaPdf,
		visualizarNomina, setVisualizarNomina
	}

}