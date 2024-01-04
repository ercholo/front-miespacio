import { useCallback, useState, useRef } from 'react';
import { useStore } from 'react-redux';
import { API } from '../api/api';

const ANO = (new Date()).getFullYear() - 1;

export const useCertificadoRetenciones = () => {

	const redux = useStore();
	const [ano, setAno] = useState(ANO);
	const [visualizarRetencion, setVisualizarRetencion] = useState(false);
	const refDescargaPdf = useRef();
	const [qRetencion, setQRetencion] = useState({
		estado: 'inicial',
		error: null,
		pdf: null
	});

	const fnDescargarPdf = useCallback(async (opciones = { visualizar: false }) => {
		const { visualizar } = opciones;

		setQRetencion({ estado: 'cargando', error: null, reservas: [] })

		try {
			const respuestaApi = await API(redux).empleados.retenciones.get(ano);
			setQRetencion({ estado: 'completado', error: null, pdf: respuestaApi })
			setVisualizarRetencion(Boolean(opciones.visualizar));

			if (!visualizar) {
				const href = window.URL.createObjectURL(respuestaApi);
				const a = refDescargaPdf.current;
				a.download = 'retencion' + ano + '.pdf';
				a.href = href;
				a.click();
				a.href = '';
			}

		} catch (error) {
			setQRetencion({ estado: 'error', error, reservas: [] })
		}

	}, [redux, setQRetencion, ano])

	return {
		ano, setAno,
		fnDescargarPdf,
		qRetencion,
		retencion: qRetencion.pdf,
		refDescargaPdf,
		visualizarRetencion, setVisualizarRetencion
	}
}