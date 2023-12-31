import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { BoxCargando, BoxErrorApi } from '../../navegacion/';
import { useCertificadoRetenciones } from "../../hooks/useCertificadoRetenciones";

// CONSTANTES
const ANO = (new Date()).getFullYear() - 1;
const ANOS = []; for (let i = 10; i >= 0; i--) ANOS.push(ANO - i);

export const PantallaRetenciones = () => {

	const {
		ano, setAno,
		fnDescargarPdf,
		qRetencion,
		retencion,
		refDescargaPdf,
		visualizarRetencion, setVisualizarRetencion
	} = useCertificadoRetenciones();

	let contenido = null;

	if (qRetencion.estado === "cargando") {
		contenido = <BoxCargando titulo="Descargando su certificado de retenciones" />
	} else if (qRetencion.error) {
		contenido = <BoxErrorApi msError={qRetencion.error} titulo="Error al descargar el certificado de retenciones" />
	}

	return (
		<>
			<a ref={refDescargaPdf} href="/" style={{ display: 'none' }}>as</a>
			<Box sx={{}}>
				<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Certificado de Retenciones</Typography>
				<Typography>
					Aquí puedes visualizar o descargar tus certificados de retenciones.
				</Typography>
				<Box sx={{ mb: 4, mt: 6, display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
					<FormControl sx={{ m: 1 }}>
						<InputLabel id="ano-helper-label" color="secondary">Año</InputLabel>
						<Select
							labelId="ano-helper-label"
							value={ano}
							label="Año"
							onChange={e => setAno(e.target.value)}
							disabled={qRetencion.estado === "cargando"}
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
					disabled={qRetencion.estado === "cargando"}
				>
					Descargar PDF
				</Button>

				<Button
					sx={{ mx: 2, mt: 1, minWidth: { xs: '100%', sm: '' }, display: { xs: 'none', sm: 'inherit' } }}
					variant="contained"
					startIcon={<SearchIcon />}
					onClick={() => fnDescargarPdf({ visualizar: true })}
					size="large"
					disabled={qRetencion.estado === "cargando"}
				>
					Visualizar
				</Button>

			</Box>

			<Box sx={{ mt: 4 }}>
				{contenido}
			</Box>


			<Dialog fullScreen fullWidth maxWidth="lg" open={Boolean(visualizarRetencion)} onClose={() => setVisualizarRetencion(false)}		>
				<DialogTitle sx={{ m: 0, mb: 0, py: 1, bgcolor: 'primary.main', color: 'primary.contrastText' }} >
					Certificado de Retenciones de {ano}
					<IconButton onClick={() => setVisualizarRetencion(false)} sx={{ position: 'absolute', right: 8, top: 4, color: th => th.palette.grey[800], }}				>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent sx={{ p: 0 }}>
					<iframe
						// frameBorder="0"
						allowFullScreen
						height="99%"
						width="100%"
						title={`Certificado de Retenciones, año ${ano}`}
						src={retencion ? window.URL.createObjectURL(retencion) : null}
						type="application/pdf"
						style={{ border: 'none', margin: 'none', padding: 'none' }}
					/>
				</DialogContent>
			</Dialog>

		</>
	)
}