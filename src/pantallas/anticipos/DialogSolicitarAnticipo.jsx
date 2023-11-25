import React from 'react';

import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, Paper, Radio, RadioGroup, Slider, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PaymentsIcon from '@mui/icons-material/Payments';

import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { consultarAnticipos, consultarHistoricoAnticipos, limpiarEstadoCreacionAnticipo, solicitarAnticipo } from '../../redux/api/anticiposSlice';
import SAP from '../../api/sap';


const SliderAnticipo = ({ codigo, nombre, disponible, pendienteAprobar, valorMinimo, innerRef, onChange, disabled }) => {

	const [solicitado, _setSolicitado] = React.useState(pendienteAprobar || 0);

	React.useEffect(() => {
		innerRef.current[codigo] = { codigo, nombre, solicitado }
		onChange?.(innerRef.current[codigo]);
	}, [innerRef, codigo, nombre, solicitado, onChange])

	const setSolicitado = React.useCallback((valorNuevo, deInput) => {
		if (valorNuevo === '') valorNuevo = 0;
		valorNuevo = +valorNuevo;
		if (valorNuevo < valorMinimo) {
			if (valorNuevo === 0) valorNuevo = 0;
			else if (!deInput) valorNuevo = valorMinimo;
		}
		else if (valorNuevo > disponible) valorNuevo = disponible;
		_setSolicitado(valorNuevo);
	}, [_setSolicitado, disponible, valorMinimo])

	const fnCambiaSlider = (_, valorNuevo) => setSolicitado(valorNuevo);
	const fnCambiaInput = (event) => setSolicitado(event.target.value, true);
	const fnBlurInput = () => setSolicitado(solicitado);

	return <Box >
		<Typography variant="h6" component="div" sx={{ color: disponible >= valorMinimo ? '' : t => t.palette.grey[700] }}>
			{nombre}
		</Typography>
		{disponible >= valorMinimo ?
			<Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>

				<Slider
					value={solicitado}
					min={0}
					max={disponible}
					onChange={fnCambiaSlider}
					sx={{ mr: 4 }}
					disabled={!Boolean(disponible) || disabled}
					color="secondary"
					valueLabelDisplay="auto"
					valueLabelFormat={x => `${x}€`}
					marks={[{ value: valorMinimo }]}

				/>
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<TextField
						color="secondary"
						value={solicitado}
						onChange={fnCambiaInput}
						onBlur={fnBlurInput}
						type="number"
						size="small"
						sx={{ width: { xs: '20ch', sm: '18ch' }, ml: { md: 2 } }}
						disabled={!Boolean(disponible) || disabled}
						InputProps={{
							endAdornment: <InputAdornment position="end">€</InputAdornment>,
							step: 1,
							min: 0,
							max: disponible + 1,
						}}
					/>
				</Box>
			</Box>
			:
			<Typography variant="body1" sx={{ mb: 2, color: t => t.palette.grey[600] }}>No es posibile solicitar el anticipo sobre la {nombre.toLowerCase()}.</Typography>
		}
	</Box >
}

const SliderPrestamo = ({ codigo, nombre, disponible, pendienteAprobar, maxCuotas, minCuotas, valorMinimo, innerRef, onChange, disabled }) => {

	const [solicitado, _setSolicitado] = React.useState(pendienteAprobar || 0);
	const [cuotas, _setCuotas] = React.useState(maxCuotas);

	React.useEffect(() => {
		innerRef.current[codigo] = { codigo, nombre, solicitado, cuotas }
		onChange?.(innerRef.current[codigo]);
	}, [innerRef, codigo, nombre, solicitado, cuotas, onChange])

	const setSolicitado = React.useCallback((valorNuevo, deInput) => {
		if (valorNuevo === '') valorNuevo = 0;
		valorNuevo = +valorNuevo;
		if (valorNuevo < valorMinimo) {
			if (valorNuevo === 0) _setSolicitado(0);
			else if (!deInput) _setSolicitado(valorMinimo);
			else _setSolicitado(valorNuevo);
		}
		else if (valorNuevo > disponible) _setSolicitado(disponible);
		else _setSolicitado(valorNuevo);
	}, [_setSolicitado, disponible, valorMinimo])

	const setCuotas = React.useCallback((valorNuevo) => {
		if (valorNuevo === '') valorNuevo = 0;
		if (valorNuevo < minCuotas) _setCuotas(minCuotas);
		else if (valorNuevo > maxCuotas) _setCuotas(maxCuotas);
		else _setCuotas(valorNuevo);
	}, [_setCuotas, maxCuotas, minCuotas])

	const fnCambiaSlider = (_, valorNuevo) => setSolicitado(valorNuevo);
	const fnCambiaInput = (event) => setSolicitado(event.target.value, true);
	const fnBlurInput = () => setSolicitado(solicitado);

	const fnCambiaSliderCuotas = (_, valorNuevo) => setCuotas(valorNuevo);
	const fnCambiaInputCuotas = (event) => setCuotas(event.target.value);

	const fnCambiaInputCuotaMes = (event) => setSolicitado(event.target.value * cuotas, true);

	return <Box >
		<Typography variant="h6" component="div" sx={{ color: disponible >= valorMinimo ? '' : t => t.palette.grey[700] }}>
			{nombre}
		</Typography>

		{disponible >= valorMinimo ? <>
			<Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
				<Slider
					value={cuotas}
					min={minCuotas}
					max={maxCuotas}
					onChange={fnCambiaSliderCuotas}
					sx={{ mr: 4 }}
					disabled={!Boolean(disponible) || disabled}
					color="secondary"
					valueLabelDisplay="auto"
					valueLabelFormat={x => `${x} meses`}
				/>
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<TextField
						color="secondary"
						value={cuotas}
						onChange={fnCambiaInputCuotas}
						type="number"
						size="small"
						sx={{ width: { xs: '20ch', sm: '18ch' }, ml: { md: 2 } }}
						disabled={!Boolean(disponible) || disabled}
						InputProps={{
							endAdornment: <InputAdornment position="end">meses</InputAdornment>,
							step: 1,
							min: minCuotas,
							max: maxCuotas,
						}}
					/>
				</Box>
			</Box>

			<Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
				<Slider value={solicitado}
					min={0}
					max={disponible}
					onChange={fnCambiaSlider}
					sx={{ mr: 4 }}
					disabled={!Boolean(disponible) || disabled}
					color="secondary"
					valueLabelDisplay="auto"
					valueLabelFormat={x => `${x}€`}
					marks={[{ value: valorMinimo }]}
				/>
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<TextField
						color="secondary"
						value={solicitado}
						onChange={fnCambiaInput}
						onBlur={fnBlurInput}
						type="number"
						size="small"
						sx={{ width: { xs: '20ch', sm: '18ch' }, ml: { md: 2 } }}
						disabled={!Boolean(disponible) || disabled}
						InputProps={{
							endAdornment: <InputAdornment position="end">€</InputAdornment>,
							step: 1,
							min: 0,
							max: disponible + 1,
						}}
					/>
					<TextField
						color="secondary"
						value={(solicitado / cuotas).toFixed(2)}
						onChange={fnCambiaInputCuotaMes}
						onBlur={fnBlurInput}
						type="number"
						size="small"
						sx={{ width: { xs: '20ch', sm: '18ch' }, ml: { md: 2 } }}
						disabled={!Boolean(disponible) || disabled}
						InputProps={{
							endAdornment: <InputAdornment position="end">€/mes</InputAdornment>,
							step: 1,
							min: 0,
							max: disponible / cuotas,
						}}
					/>
				</Box>
			</Box>
		</>
			:
			<Typography variant="body1" sx={{ color: t => t.palette.grey[600] }}>No es posibile solicitar el {nombre.toLowerCase()}.</Typography>
		}
	</Box >
}

export default function DialogSolicitarAnticipo() {

	const dispatch = useDispatch();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [abierto, setAbierto] = React.useState(false);




	const anticipos = useSelector(state => state.anticipos.resultado);
	const solicitudAnticipo = useSelector(state => state.anticipos.solicitudAnticipo);

	const refAnticipos = React.useRef({});
	const refPrestamos = React.useRef({});

	const [totalAnticipos, setTotalAnticipos] = React.useState({ solicitado: 0 })
	const fnCalculoTotalAnticipos = React.useCallback(() => {
		setTotalAnticipos(
			Object.entries(refAnticipos.current).map(e => e[1]).reduce((t, el) => {
				return { solicitado: t.solicitado + el.solicitado }
			}, { solicitado: 0 })
		)
	}, [refAnticipos, setTotalAnticipos])
	const [totalPrestamos, setTotalPrestamos] = React.useState([])
	const fnCalculoTotalPrestamos = React.useCallback(() => {
		setTotalPrestamos(
			Object.entries(refPrestamos.current).map(e => e[1])
		);
	}, [refPrestamos, setTotalPrestamos])

	const [metodoIngreso, setMetodoIngreso] = React.useState('N');

	const fnSolicitarPerricas = React.useCallback(() => {
		dispatch(solicitarAnticipo({
			anticipos: refAnticipos.current,
			prestamos: refPrestamos.current,
			metodoIngreso
		}));
	}, [dispatch, refAnticipos, refPrestamos, metodoIngreso])


	React.useEffect(() => {
		if (solicitudAnticipo.resultado === true) {
			setAbierto(false);
			dispatch(limpiarEstadoCreacionAnticipo());
			dispatch(consultarAnticipos());
			dispatch(consultarHistoricoAnticipos());
		}
	}, [dispatch, solicitudAnticipo.resultado])


	let cargando = solicitudAnticipo.estado === 'cargando';
	let totalSolicitadoEnPrestamos = totalPrestamos.reduce((total, prestamo) => total + prestamo.solicitado, 0)




	return <>
		<Button variant="contained" onClick={() => setAbierto(true)} startIcon={<PaymentsIcon />} sx={{ m: 1 }} size="large">
			Solicitar anticipos
		</Button>
		<Dialog fullScreen={fullScreen} fullWidth maxWidth="lg" open={abierto} onClose={() => !cargando && setAbierto(false)} >
			<DialogTitle sx={{ m: 0, mb: 0, py: 1, bgcolor: 'primary.main', color: 'primary.contrastText' }} >
				Solicitar anticipos
				<IconButton disabled={cargando} onClick={() => setAbierto(false)} sx={{ position: 'absolute', right: 8, top: 4, color: (t) => t.palette.grey[800] }}			>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: 4, mt: 2 }}>
				<Grid container>
					<Grid item xs={12} md={8}>
						<Stack sx={{ px: { md: 6 }, py: { md: 4 } }}>
							{anticipos.anticipos.map(anticipo => <SliderAnticipo
								key={anticipo.nombre}
								{...anticipo}
								valorMinimo={75}
								innerRef={refAnticipos}
								onChange={fnCalculoTotalAnticipos}
								disabled={cargando}
							/>)}
						</Stack>
						<Stack sx={{ px: { md: 6 }, py: 4 }}>
							{anticipos.prestamos.map(prestamo => <SliderPrestamo
								key={prestamo.nombre}
								{...prestamo}
								valorMinimo={75}
								maxCuotas={36}
								minCuotas={6}
								innerRef={refPrestamos}
								onChange={fnCalculoTotalPrestamos}
								disabled={cargando}
							/>)}
						</Stack>
					</Grid>
					<Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'column' }, justifyContent: 'space-between', mb: 3 }}>
						<Box>
							<Paper elevation={3} sx={{ mt: { xs: 2, md: 8 }, px: 4, pt: 2, pb: { xs: 4, md: 2 } }}>
								<Typography component="div" variant="h6" >Resumen</Typography>
								{(totalAnticipos.solicitado > 0 || totalSolicitadoEnPrestamos > 0) ?

									<Box sx={{ ml: 0, mt: 1 }}>
										{totalAnticipos.solicitado > 0 &&
											<Box >
												<Typography component="div" variant="body1" color="secondary">Adelantos sobre pagas</Typography>
												<Typography component="div" sx={{ mt: 1, ml: 4, fontWeight: 'bold', fontSize: '115%' }}>{totalAnticipos.solicitado.toFixed(2)}€</Typography>
											</Box>
										}
										{
											totalPrestamos.map(prestamo => prestamo.solicitado > 0 ? <Box key={prestamo.nombre} sx={{ mt: totalAnticipos.solicitado > 0 ? 3 : 0 }}>
												<Typography component="div" variant="body1" color="secondary">{prestamo.nombre}</Typography>
												<Typography component="div" sx={{ mt: 1, ml: 4, fontWeight: 'bold', fontSize: '115%' }}>{prestamo.solicitado.toFixed(2)}€</Typography>
												<Typography component="div" sx={{ ml: 4 }} variant="body2">A devolver en {prestamo.cuotas} cuotas de {(prestamo.solicitado / prestamo.cuotas).toFixed(2)}€</Typography>
											</Box> : null
											)
										}
									</Box>
									:
									<Box sx={{ mt: 1 }}>
										<Typography component="div" variant="body1" color="secondary">No se solicitará nada</Typography>
										<Typography component="div" variant="caption" color="disabled">Se cancelará cualquier solicitud que estuviera pendiente de aprobar.</Typography>
									</Box>
								}
							</Paper>


							{solicitudAnticipo.error &&
								<Alert severity="error" sx={{ mt: 2 }}>
									<AlertTitle>Ocurrió un error al realizar la solicitud</AlertTitle>
									{SAP.err2text(solicitudAnticipo.error)}
								</Alert>
							}
						</Box>

						<Box sx={{ mb: 3, mt: 0 }}>
							<Typography component="div" variant="h6">A ingresar en:</Typography>
							<FormControl sx={{ ml: 4, mt: 1 }} >
								<RadioGroup defaultValue="N"
									value={metodoIngreso}
									onChange={(e) => setMetodoIngreso(e.target.value)}
									disabled={cargando}
								>
									<FormControlLabel disabled={cargando} value="N" control={<Radio color="secondary" />} label="Cuenta nómina" />
									<FormControlLabel disabled={cargando} value="F" control={<Radio color="secondary" />} label="Farmacuenta" />
								</RadioGroup>
							</FormControl>
						</Box>


					</Grid>
				</Grid>

			</DialogContent >
			<DialogActions sx={{ px: 4, mb: 2 }}>
				<Button onClick={() => setAbierto(false)} color="secondary" startIcon={<CloseIcon />} disabled={cargando} variant="outlined">
					Descartar cambios
				</Button>
				<Button
					onClick={fnSolicitarPerricas}
					variant="contained"
					startIcon={<PaymentsIcon />}
					disabled={cargando}
				>
					Enviar solicitud
				</Button>
			</DialogActions>
		</Dialog >
	</>
}