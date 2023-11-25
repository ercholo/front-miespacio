import { Alert, AlertTitle, Box, CircularProgress, Grid, Paper, Typography } from "@mui/material"
import SAP from "../../api/sap";
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { consultarHistoricoAnticipos } from "../../redux/api/anticiposSlice";


const LineaAnticipo = ({ fecha, cantidades, estado, pago, comentarios }) => {


	function getColor(estadoSolicitud) {
		switch (estadoSolicitud) {
			case 'aprobado': return 'success.main';
			case 'pendiente': return 'info.main';
			case 'rechazado': return 'error.main';
			default: return 'text.disabled';
		}
	}

	function convertirClave(clave) {
		switch (clave.toLowerCase()) {
			case 'nominames': return 'Nómina';
			case 'navidad': return 'Navidad';
			case 'verano': return 'Verano';
			case 'beneficios': return 'Beneficios';
			case 'prestamo': return 'Préstamo';
			case 'credito': return 'Crédito';
			default: return 'text.disabled';
		}
	}

	function convertirPago(metodoPago) {
		switch (metodoPago) {
			case 'N': return <>» <strong>CUENTA DE NÓMINA</strong></>;
			case 'F': return <>» <strong>FARMACUENTA</strong></>;
			default: return <>Desconocido</>;
		}
	}

	let conceptos = Object.entries(cantidades).filter(e => e[1] > 0);

	return <Paper elevation={3} sx={{ mb: 2, p: 2 }} >
		<Grid container>
			<Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'row', justifyContent: { xs: 'space-evenly', md: 'flex-start' } }}>
				<Grid container>
					<Grid item xs={6} md={3} lg={6}>
						<Typography variant="body1" sx={{ color: getColor(estado), fontWeight: 'bold', mr: 2 }} component="span">
							{estado.toUpperCase()}
						</Typography>
					</Grid>
					<Grid item xs={6} md={9} lg={6} sx={{ textAlign: { xs: 'right', md: 'left' } }}>
						<Typography variant="body1" component="span">
							{format(parse(fecha, 'yyyyMMdd', new Date()), 'dd MMMM yyyy', { locale: es })}
						</Typography>
					</Grid>
					{estado !== 'rechazado' && <Grid item xs={12}>
						<Typography variant="body2" component="span">
							{convertirPago(pago)}
						</Typography>
					</Grid>}
					{comentarios && <Grid item xs={12}>
						<Typography variant="body2" component="span">
							{comentarios}
						</Typography>
					</Grid>}

				</Grid>
			</Grid>
			<Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'row', justifyContent: { xs: 'space-evenly', sm: 'flex-start' }, mt: { xs: 2, lg: 0 }, flexWrap: 'wrap', gap: 2 }} >
				{conceptos.map((c) => <Box key={c[0]} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', px: 1 }} >
					<Typography variant="caption" sx={{ fontSize: '90%' }} component="div">
						{convertirClave(c[0])}
					</Typography>
					<Typography variant="body1" sx={{ fontWeight: 'bold' }} component="div">
						{c[1].toFixed(2)}€
					</Typography>
				</Box>)}
			</Grid>
		</Grid>
	</Paper>
}



export default function TableHistoricoAnticipos() {

	const dispatch = useDispatch();
	const anticipos = useSelector(state => state.anticipos.historico.resultado);
	const estado = useSelector(state => state.anticipos.historico.estado);
	const error = useSelector(state => state.anticipos.historico.error);

	React.useEffect(() => {
		dispatch(consultarHistoricoAnticipos());
	}, [dispatch])

	if (estado === 'cargando' || estado === 'inicial') {
		return <>
			<Typography variant="h5" sx={{ mt: 6, mb: 2 }} component="div">Histórico de solicitudes</Typography>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
				<CircularProgress size={40} />
				<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Consultando histórico de anticipos</Typography>
			</Box>
		</>
	} else if (error) {
		return <>
			<Typography variant="h5" sx={{ mt: 6, mb: 2 }} component="div">Histórico de solicitudes</Typography>
			<Alert severity="error" >
				<AlertTitle>Ocurrió un error al realizar la consulta</AlertTitle>
				{SAP.err2text(error)}
			</Alert>
		</>
	} else if (!anticipos?.length) {
		return 'No historico';
	}

	return <>
		<Typography variant="h5" sx={{ mt: 6, mb: 2 }} component="div">Histórico de solicitudes</Typography>
		<Box sx={{ my: 2 }}>
			{anticipos.map((anticipo, i) => <LineaAnticipo key={i} {...anticipo} />)}
		</Box>
	</>


}