import { addDays } from 'date-fns';
import { BoxCargando, BoxErrorApi } from '../../navegacion/';
import { useNominas } from '../../hooks/useNominas';

import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Typography, /*useMediaQuery*/ } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

// CONSTANTES
const TOMORROW = addDays(new Date(), 3); // hace que se pueda seleccionar el mes que viene 3 días antes de que llegue
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const ANO = TOMORROW.getMonth() - 1 < 0 ? TOMORROW.getFullYear() - 1 : TOMORROW.getFullYear();
const ANOS = []; for (let i = 10; i >= 0; i--) ANOS.push(ANO - i);

export const PantallaNomina = () => {

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

	return (
		<>
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
	)

}