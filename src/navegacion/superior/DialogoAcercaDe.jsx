import PropTypes from 'prop-types';

// MUI
import { Dialog, Button, IconButton, Typography, DialogActions, DialogContent } from '@mui/material/';

// ICONOS
import InfoIcon from '@mui/icons-material/Info';

export const DialogoAcercaDe = ({ abierto, fnAbrirDialogoApi, fnCerrarDialogoApi }) => {

	return (
		<>
			<IconButton onClick={fnAbrirDialogoApi} color="inherit" >
				<InfoIcon />
			</IconButton>

			<Dialog open={abierto} onClose={fnCerrarDialogoApi} fullWidth>

				<DialogContent>

					<Typography variant="h5" component="div">
						Tu Espacio
					</Typography>

					<Typography variant="body1" component="div">
						Grupo HEFAME &copy; 2023
					</Typography>

					<Typography variant="body1" component="div" sx={{ mt: 2 }}>
						Versión del interfaz web: <strong>v2.0.1</strong>
					</Typography>

				</DialogContent>

				<DialogActions>
					<Button variant="contained" onClick={fnCerrarDialogoApi}>Cerrar</Button>
				</DialogActions>

			</Dialog>
		</>
	)
}

DialogoAcercaDe.propTypes = {
	abierto: PropTypes.bool,
	fnAbrirDialogoApi: PropTypes.func,
	fnCerrarDialogoApi: PropTypes.func,
};