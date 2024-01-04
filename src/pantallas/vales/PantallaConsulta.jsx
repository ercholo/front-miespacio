import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Alert, AlertTitle, Box, Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, LinearProgress, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch, useSelector } from 'react-redux';
import { consultarVales } from '../../redux/api/valesSlice';
import { completarDescargaAlbaranPdf, descargarAlbaranPdf, descartarErroresAlbaranPdf, preparaDescargaAlbaranPdf } from '../../redux/api/albaranPdfSlice';
import SAP from '../../api/sap';
import PropTypes from 'prop-types';

// CONSTANTES
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const ANO = (new Date()).getFullYear();
const MES = (new Date()).getMonth();
const ANOS = []; for (let i = 10; i >= 0; i--) ANOS.push(ANO - i);


//Es la destructuración de 'vales'
const LineaVale = memo(({ numeroAlbaran, fechaCreacion, precio, unidades, lineas, fnVisualizarAlbaran }) => {

	const dispatch = useDispatch();
	const refDescargaPdf = useRef();
	const albaranes = useSelector(state => state.albaranPdf.descargas);
	const albaran = albaranes[numeroAlbaran];

	const lanzarDescarga = useCallback(async () => {
		const base64Response = await fetch(`data:application/pdf;base64,${albaran.pdf}`);
		const blob = await base64Response.blob();
		const href = window.URL.createObjectURL(blob);
		const a = refDescargaPdf.current;
		a.download = 'valeEmpleado' + numeroAlbaran + '.pdf';
		a.href = href;
		a.click();
		a.href = '';
		dispatch(completarDescargaAlbaranPdf(numeroAlbaran));
	}, [dispatch, numeroAlbaran, albaran])

	const lanzarVisualizacion = useCallback(async () => {
		fnVisualizarAlbaran({ numeroAlbaran, pdf: albaran.pdf });
		dispatch(completarDescargaAlbaranPdf(numeroAlbaran));
	}, [dispatch, numeroAlbaran, fnVisualizarAlbaran, albaran])

	const fnDescargarAlbaran = useCallback(modoVisualizacion => {

		if (albaran?.estado === "completado" && albaran.pdf) {
			if (modoVisualizacion === 'descarga') lanzarDescarga();
			else if (modoVisualizacion === 'visualizar') lanzarVisualizacion();
			return;
		}

		dispatch(preparaDescargaAlbaranPdf({ numeroAlbaran, modoVisualizacion }));
		dispatch(descargarAlbaranPdf({ numeroAlbaran, modoVisualizacion }));
	}, [dispatch, albaran, numeroAlbaran, lanzarDescarga, lanzarVisualizacion]);

	const fnLimpiarErrorDescarta = useCallback(() => {
		dispatch(descartarErroresAlbaranPdf(numeroAlbaran));
	}, [dispatch, numeroAlbaran])

	useEffect(() => {
		if (albaran?.estado === "completado" && albaran.pdf) {
			if (albaran.modoVisualizacion === 'descarga') lanzarDescarga();
			else if (albaran.modoVisualizacion === 'visualizar') lanzarVisualizacion();
		}
		else if (albaran?.estado === "error" && albaran?.modoVisualizacion !== "completado") {
			dispatch(completarDescargaAlbaranPdf(numeroAlbaran));
		}
	}, [dispatch, albaran, numeroAlbaran, lanzarDescarga, lanzarVisualizacion])


	return (
		<Paper sx={{ p: 1, mb: 1, fontSize: '110%' }} square >
			<a ref={refDescargaPdf} href="/" style={{ display: 'none' }}>as</a>

			<Box sx={{ display: { xs: 'flex', sm: 'inline-flex' }, alignItems: { xs: 'stretch', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' } }}>

				<Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
					{albaran?.estado === 'cargando' ? <><LinearProgress sx={{ mt: 2.3, mb: 2.2, width: '88px' }} /></> : <>
						<IconButton sx={{ ml: 1 }} color="secondary" onClick={() => fnDescargarAlbaran('descarga')} disabled={albaran?.estado === 'cargando'}>
							<PictureAsPdfIcon />
						</IconButton>
						<IconButton color="secondary" onClick={() => fnDescargarAlbaran('visualizar')} disabled={albaran?.estado === 'cargando'}>
							<SearchIcon />
						</IconButton>
					</>}
				</Box>

				<Box sx={{ display: { xs: 'block', sm: 'inline-flex' }, py: { xs: 2, sm: 0 }, mx: { xs: 0, sm: 1 } }} >
					<Typography variant="body1" component="span" sx={{ fontWeight: 'bold', ml: 2 }}>{fechaCreacion}</Typography>
					<Typography variant="body1" component="span" sx={{ ml: 3 }}>{numeroAlbaran}</Typography>
					<Typography variant="body1" component="span" sx={{ fontWeight: 'bold', ml: 3 }}>{precio} €</Typography>
					<Typography variant="body1" component="span" sx={{ color: 'text.disabled', display: { xs: 'none', md: 'inline' }, ml: 3 }}>
						({unidades} unidad{unidades !== 1 && 'es'} en {lineas} línea{ }{lineas !== 1 && 's'})
					</Typography>
				</Box>

				<Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'flex-end' }}>
					{albaran?.estado === 'cargando' && <><CircularProgress size={20} sx={{ mt: 1, mr: 1.4 }} /></>}
					<Button sx={{ ml: 1 }} color="secondary" onClick={() => fnDescargarAlbaran('descarga')} disabled={albaran?.estado === 'cargando'} >
						Descargar
					</Button>
					<Button sx={{ ml: 1, px: 2 }} color="secondary" onClick={() => fnDescargarAlbaran('visualizar')} disabled={albaran?.estado === 'cargando'}>
						Visualizar
					</Button>
				</Box>

			</Box>

			{
				albaran?.error &&
				<Box sx={{ m: 1 }}>
					<Alert severity='error' sx={{ py: 0 }} onClose={fnLimpiarErrorDescarta}>
						<AlertTitle>Error en la descarga</AlertTitle>
						{SAP.err2text(albaran?.error)}
					</Alert>
				</Box>
			}
		</Paper>
	)
})

LineaVale.displayName = 'LineaVale';

export const PantallaConsulta = () => {

	const dispatch = useDispatch();
	const [fecha, _setFecha] = useState({ mes: MES, ano: ANO });
	const [modoBusqueda, _setModoBusqueda] = useState('mesNatural');

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
			let mes = (e.target.value === ANO && f.mes > MES ? MES : f.mes)
			if (modoBusqueda === 'periodoNomina') {
				mes = (e.target.value === ANO && f.mes > MES - 1 ? MES - 1 : f.mes)
			}
			return {
				ano: e.target.value,
				mes
			}
		});
	}, [_setFecha, modoBusqueda]);

	const setModoBusqueda = useCallback(() => {
		let nuevoModoBusqueda = modoBusqueda === 'mesNatural' ? 'periodoNomina' : 'mesNatural'
		if (nuevoModoBusqueda === 'periodoNomina' && fecha.mes === MES && fecha.ano === ANO) {
			if (fecha.mes === 0) {
				_setFecha({
					ano: fecha.ano - 1,
					mes: 11
				})
			} else {
				_setFecha(f => {
					return {
						ano: f.ano,
						mes: f.mes - 1
					}
				})
			}
		}
		_setModoBusqueda(nuevoModoBusqueda);
	}, [fecha, modoBusqueda, _setModoBusqueda, _setFecha])


	let mesesDisponibles = fecha.ano === ANO ? MESES.slice(0, MES + 1) : [...MESES];
	if (modoBusqueda === 'periodoNomina' && fecha.ano === ANO) mesesDisponibles.pop();
	let anosDisponibles = [...ANOS];
	if (modoBusqueda === 'periodoNomina' && MES === 0) anosDisponibles.pop()


	useEffect(() => {
		dispatch(consultarVales({ ...fecha, modoBusqueda }))
	}, [dispatch, fecha, modoBusqueda])


	const estadoConsultaVales = useSelector(state => state.vales.estado);
	const vales = useSelector(state => state.vales.resultado);
	const error = useSelector(state => state.vales.error);
	const [visualizarAlbaran, setVisualizarAlbaran] = useState(null);

	let contenido = null;

	if (estadoConsultaVales === "cargando") {
		contenido =
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
				<CircularProgress size={40} />
				<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Consultando vales</Typography>
			</Box>
	} else if (error) {
		contenido =
			<Alert severity="error" >
				<AlertTitle>Ocurrió un error al realizar la consulta</AlertTitle>
				{SAP.err2text(error)}
			</Alert>
	} else if (vales?.length > 0) {
		contenido =
			<Stack sx={{ mt: 2 }}>
				{vales.map((vale, i) => {
					return <LineaVale key={i} {...vale} fnVisualizarAlbaran={setVisualizarAlbaran} />
				})}
			</Stack>
	} else {
		contenido =
			<Box sx={{ m: 'auto', textAlign: 'center' }}>
				<div><SentimentNeutralIcon sx={{ width: '60px', height: '60px', color: 'secondary.light' }} /></div>
				<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Sin resultados</Typography>
			</Box>
	}

	let labelBusqueda = '';
	if (modoBusqueda === 'mesNatural') {
		labelBusqueda = `Se muestran vales realizados durante el mes de ${MESES[fecha.mes]} de ${fecha.ano}`
	} else {
		labelBusqueda = `Se muestran vales incluidos en tu nómina de ${MESES[fecha.mes]} de ${fecha.ano}`
	}

	return (
		<>
			<Box sx={{ m: 'auto' }}>
				<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Mis vales</Typography>
				<Typography>Para consultar tus Vales de Emplead@, selecciona el mes y el año que deseas visualizar.</Typography>

				<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
					<FormControl sx={{ m: 1 }}>
						<InputLabel id="mes-helper-label" color="secondary">Mes</InputLabel>
						<Select
							labelId="mes-helper-label"
							value={fecha.mes}
							label="Mes"
							onChange={setMes}
							disabled={estadoConsultaVales === "cargando"}
							color="secondary"
							sx={{ width: '20ch' }}
						>
							{mesesDisponibles.map((nombreMes, i) => <MenuItem key={nombreMes} value={i}>{nombreMes}</MenuItem>)}
						</Select>
					</FormControl>

					<FormControl sx={{ m: 1 }}>
						<InputLabel id="ano-helper-label" color="secondary">Año</InputLabel>
						<Select
							labelId="ano-helper-label"
							value={fecha.ano}
							label="Año"
							onChange={setAno}
							disabled={estadoConsultaVales === "cargando"}
							color="secondary"
							sx={{ width: '12ch' }}
						>
							{anosDisponibles.map(nombreAno => <MenuItem key={nombreAno} value={nombreAno}>{nombreAno}</MenuItem>)}
						</Select>
					</FormControl>
				</Box>
				<Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

					<FormControlLabel control={<Checkbox color="secondary" checked={modoBusqueda === 'periodoNomina'} onChange={setModoBusqueda} />} label="Buscar por nómina" />
					<Typography component="div" variant="caption">
						{labelBusqueda}
					</Typography>
				</Box>
			</Box>

			{contenido}

			<Dialog fullScreen fullWidth maxWidth="lg" open={Boolean(visualizarAlbaran)} onClose={() => setVisualizarAlbaran(false)}		>
				<DialogTitle sx={{ m: 0, mb: 0, py: 1, bgcolor: 'primary.main', color: 'primary.contrastText' }} >
					Vale de emplead@: Albarán {visualizarAlbaran?.numeroAlbaran}
					<IconButton
						onClick={() => setVisualizarAlbaran(null)}
						sx={{ position: 'absolute', right: 8, top: 4, color: (t) => t.palette.grey[800] }}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent sx={{ p: 0 }}>
					<iframe
						frameBorder="0"
						allowFullScreen
						height="99%"
						width="100%"
						title={`Vale de emplead@: Albarán ${visualizarAlbaran?.numeroAlbaran}`}
						src={"data:application/pdf;base64," + visualizarAlbaran?.pdf}
						type="application/pdf"
						style={{ border: 'none' }}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}

LineaVale.propTypes = {
	numeroAlbaran: PropTypes.string,
	fechaCreacion: PropTypes.string,
	precio: PropTypes.number,
	unidades: PropTypes.number,
	lineas: PropTypes.number,
	fnVisualizarAlbaran: PropTypes.func,
};

