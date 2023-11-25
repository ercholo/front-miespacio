import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ReplayIcon from '@mui/icons-material/Replay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { redux_gestionViajes_limpiarSolicitud, redux_gestionViajes_select_EstadoSolicitud, redux_gestionViajes_solicitar } from '../../../redux/gestion/viajesSlice';

import Paso, { PASOS, useFormularioViajes } from './pasos/Pasos';
import { BoxErrorApi } from '../../../navegacion/BoxErrorApi';
import { BoxCargando } from '../../../navegacion/BoxCargando';



// Convierte los datos del formulario en un payload válido
// para ser enviado al API
const formularioToApi = (f) => {

	return {
		aceptaNormativa: f.aceptaNormativa,
		motivo: f.motivo,
		tipo: f.tipo,
		pep: f.pep || undefined,
		viajeros: f.datosViajeros.filter(viajero => viajero.nombre && viajero.centroCoste).map(viajero => {
			return {
				nombre: viajero.nombre,
				centroCoste: viajero.centroCoste
			}
		}),
		transportes: [
			{
				medioTransporte: f.medioTransporte,
				fechaViaje: f.fechaViaje,
				origen: f.origen,
				destino: f.destino,
				horaSalida: f.horaSalida,
				horaLlegada: f.horaLlegada
			}
		],
		hoteles: f.datosHoteles.filter(hotel => hotel.nombre).map(hotel => {
			return {
				nombre: hotel.nombre,
				fechaEntrada: hotel.fechaEntrada,
				numeroNoches: hotel.numeroNoches,
				solicitaParking: hotel.solicitaParking
			}
		}),
		observaciones: f.observaciones,
		emailResponsable: f.email
	}
}

export default function PantallaGestionViajesTrabajo() {

	const dispatch = useDispatch();
	const theme = useTheme();
	const modoMovil = useMediaQuery(theme.breakpoints.down('sm'));

	const [activeStep, setActiveStep] = React.useState(0);
	const formulario = useFormularioViajes();

	const solicitud = useSelector(redux_gestionViajes_select_EstadoSolicitud);



	React.useEffect(() => {
		if (activeStep === PASOS.length && solicitud.estado === 'inicial') {

			let solicitudViaje = formularioToApi(formulario);
			dispatch(redux_gestionViajes_solicitar(solicitudViaje));
		}
		if (solicitud.estado === 'completado') {
			formulario.reset();
		}
	// eslint-disable-next-line
	}, [activeStep, dispatch,  solicitud])

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = (preservarEstado) => {
		setActiveStep(0);
		dispatch(redux_gestionViajes_limpiarSolicitud())
		if (!preservarEstado) formulario.reset();
	};

	const desactivarSiguiente = [
		/*PASO0*/ !Boolean(formulario.aceptaNormativa),

		/*PASO1*/ !Boolean(formulario.motivo.trim()),
		// Que haya relleno el motivo

		/*PASO2*/ formulario.datosViajeros.filter((viajero, i) => i < formulario.numeroViajeros && viajero.nombre.trim() && viajero.centroCoste).length !== formulario.numeroViajeros,
		// Que todos los viajeros tengan nombre

		/*PASO3*/ (formulario.medioTransporte !== 'propio') && !(formulario.origen.trim() && formulario.destino.trim()),

		/*PASO4*/ formulario.datosHoteles.filter((hotel, i) => i < formulario.numeroHoteles && hotel.nombre.trim()).length !== formulario.numeroHoteles,
		// Que todos los hoteles tengan nombre

		/*PASO5*/ !Boolean(formulario.email.trim()),
	]


	//* ESTADO DE CARGA DE LA SOLICITUD *//
	let boxEstadoCarga = null;
	if (solicitud.estado === 'cargando') {
		boxEstadoCarga = <BoxCargando>
			Registrando solicitud ...
		</BoxCargando>
	} else if (solicitud.error) {
		boxEstadoCarga = <Box>
			<BoxErrorApi msError={solicitud.error} titulo="Ocurrió un error al realizar la solicitud" />
			<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', pt: 2 }}>
				<Button variant='contained' onClick={() => handleReset(true)} startIcon={<ReplayIcon />}>Revisar datos</Button>
			</Box>
		</Box>
	} else {
		boxEstadoCarga = <Box sx={{ display: 'flex', flexDirection: 'column', mt: 10 }}>
			<CheckCircleOutlineIcon color="success" sx={{ mx: 'auto', width: '100px', height: '100px' }} />
			<Typography variant="caption" component="div" sx={{ fontSize: '110%', mx: 'auto', mt: 3, textAlign: 'center', fontWeight: 'bold' }}>
				Su solicitud se ha registrado correctamente
			</Typography>
			<Typography variant="body2" component="div" sx={{ mx: 'auto', mt: 0, textAlign: 'center' }}>
				Hemos enviado un correo a su email con los detalles de la misma
			</Typography>
			<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', pt: 2 }}>
				<Button variant='contained' onClick={handleReset} startIcon={<CheckCircleOutlineIcon />}>Continuar</Button>
			</Box>
		</Box>
	}


	return <Box sx={{ width: '100%' }}>
		{modoMovil ?
			<>
				<Typography variant="caption">
					{activeStep < PASOS.length && <>Paso {activeStep + 1} de {PASOS.length}</>}
				</Typography>
			</>
			:
			<Stepper activeStep={activeStep} alternativeLabel color="secondary" sx={{ mb: 4 }}>
				{PASOS.map((label, index) => {
					return (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
		}
		{activeStep === PASOS.length ? (
			boxEstadoCarga
		) : (
			<>
				<Paso numeroPaso={activeStep} {...formulario} />
				<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 4 }}>
					{activeStep === 0 ?
						<>
							<Box sx={{ flex: '1 1 auto' }} />
							<Button
								size="large"
								color="primary"
								variant="contained"
								onClick={handleNext} sx={{ mr: 1 }}
								endIcon={<PlayArrowIcon />}
								disabled={desactivarSiguiente[activeStep]}
							>Comenzar</Button>
						</>
						:
						<>
							<Button color="secondary" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Anterior</Button>
							<Box sx={{ flex: '1 1 auto' }} />
							<Button
								disabled={desactivarSiguiente[activeStep]}
								onClick={handleNext}
								color={activeStep === PASOS.length - 1 ? 'primary' : 'secondary'}
								variant="contained"
							>
								{activeStep === PASOS.length - 1 ? 'Solicitar viaje' : 'Siguiente'}
							</Button>
						</>
					}
				</Box>

			</>
		)}
	</Box>
}