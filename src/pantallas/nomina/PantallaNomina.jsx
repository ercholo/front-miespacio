import React from 'react';

import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Typography, /*useMediaQuery*/ } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { addDays } from 'date-fns';
import API from '../../api/api';
import { useStore } from 'react-redux';
import BoxCargando from '../../navegacion/BoxCargando';
import BoxErrorApi from '../../navegacion/BoxErrorApi';



// CONSTANTES
const TOMORROW = addDays(new Date(), 3); // hace que se pueda seleccionar el mes que viene 3 días antes de que llegue
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MES = TOMORROW.getMonth() - 1 < 0 ? 11 : TOMORROW.getMonth() - 1;
const ANO = TOMORROW.getMonth() - 1 < 0 ? TOMORROW.getFullYear() - 1 : TOMORROW.getFullYear();
const ANOS = []; for (let i = 10; i >= 0; i--) ANOS.push(ANO - i);



const useNominas = () => {

	const redux = useStore();

	const [fecha, _setFecha] = React.useState({ mes: MES, ano: ANO });
	const setMes = React.useCallback((e) => {
		_setFecha(f => {
			return {
				ano: f.ano,
				mes: e.target.value
			}
		});
	}, [_setFecha]);
	const setAno = React.useCallback((e) => {
		_setFecha(f => {
			return {
				ano: e.target.value,
				mes: (e.target.value === ANO && f.mes > MES ? MES : f.mes)
			}
		});
	}, [_setFecha]);
	const mesesDisponibles = fecha.ano === ANO ? MESES.slice(0, MES + 1) : [...MESES];

	const [visualizarNomina, setVisualizarNomina] = React.useState(false);
	const refDescargaPdf = React.useRef();
	const [qNomina, setQnomina] = React.useState({
		estado: 'inicial',
		error: null,
		pdf: null
	});

	const fnDescargarPdf = React.useCallback(async (opciones = { visualizar: false }) => {
		const { visualizar } = opciones;
		setQnomina({ estado: 'cargando', error: null })
		try {
			let mes = ('0' + (fecha.mes+1)).slice(-2);
			const respuestaApi = await API(redux).empleados.nominas.get(fecha.ano, mes);
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

	}, [redux, setQnomina, setVisualizarNomina, fecha])

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





export default function PantallaNomina() {

	const {
		ano, mes,
		setAno, setMes,
		mesesDisponibles,
		fnDescargarPdf,
		qNomina,
		nomina,
		refDescargaPdf,
		visualizarNomina, setVisualizarNomina
	} = useNominas();



	let contenido = null;

	if (qNomina.estado === "cargando") {
		contenido = <BoxCargando titulo="Descargando su nómina" />
	} else if (qNomina.error) {
		contenido = <BoxErrorApi msError={qNomina.error} titulo="Error al descargar su nómina" />
	}

	return <>
		<a ref={refDescargaPdf} href="/" style={{ display: 'none' }}>as</a>
		<Box sx={{}}>
			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Mis nóminas</Typography>
			<Typography>
				Aquí puedes visualizar o descargar tus recibos de salario.
			</Typography>
			<Box sx={{ mb: 4, mt: 6, display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
				<FormControl sx={{ m: 1 }}>
					<InputLabel id="mes-helper-label" color="secondary">Mes</InputLabel>
					<Select
						labelId="mes-helper-label"
						value={mes}
						label="Mes"
						onChange={setMes}
						disabled={qNomina.estado === "cargando"}
						color="secondary"
						sx={{ width: '20ch' }}
					>
						{mesesDisponibles.map((nombreMes, i) => <MenuItem key={i} value={i}>{nombreMes}</MenuItem>)}
					</Select>
				</FormControl>
				<FormControl sx={{ m: 1 }}>
					<InputLabel id="ano-helper-label" color="secondary">Año</InputLabel>
					<Select
						labelId="ano-helper-label"
						value={ano}
						label="Año"
						onChange={setAno}
						disabled={qNomina.estado === "cargando"}
						color="secondary"
						sx={{ width: '12ch' }}
					>
						{ANOS.map(nombreAno => <MenuItem key={nombreAno} value={nombreAno}>{nombreAno}</MenuItem>)}
					</Select>
				</FormControl>
			</Box>
		</Box>

		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
			<Button
				sx={{ mx: 2, mt: 1, minWidth: { xs: '100%', sm: '' } }}
				variant="contained"
				startIcon={<PictureAsPdfIcon />} onClick={() => fnDescargarPdf({ visualizar: false })}
				size="large"
				disabled={qNomina.estado === "cargando"}
			>
				Descargar PDF
			</Button>
			<Button
				sx={{ mx: 2, mt: 1, minWidth: { xs: '100%', sm: '' } }}
				variant="contained"
				startIcon={<SearchIcon />}
				onClick={() => fnDescargarPdf({ visualizar: true })}
				size="large"
				disabled={qNomina.estado === "cargando"}
			>
				Visualizar
			</Button>
		</Box>

		<Box sx={{ mt: 4 }}>
			{contenido}
		</Box>


		<Dialog fullScreen fullWidth maxWidth="lg" open={Boolean(visualizarNomina)} onClose={() => setVisualizarNomina(false)}		>
			<DialogTitle sx={{ m: 0, mb: 0, py: 1, bgcolor: 'primary.main', color: 'primary.contrastText' }} >
				Nómina: {MESES[mes].toLowerCase()} de {ano}
				<IconButton onClick={() => setVisualizarNomina(false)} sx={{ position: 'absolute', right: 8, top: 4, color: th => th.palette.grey[800], }}				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ p: 0 }}>
				<iframe
					frameBorder="0"
					allowFullScreen
					height="99%"
					width="100%"
					title={`Nómina: ${MESES[mes].toLowerCase()} de ${ano}`}
					src={nomina ? window.URL.createObjectURL(nomina) : null}
					type="application/pdf"
					style={{ border: 'none', margin: 'none', padding: 'none' }}
				/>
			</DialogContent>
		</Dialog>



	</>


}