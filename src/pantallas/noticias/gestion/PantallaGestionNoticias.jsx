import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Stack, Typography } from "@mui/material";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral"
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch, useSelector } from 'react-redux';
import { preBusquedaNoticias } from '../../../redux/api/noticiasGestion/noticiasGestionSlice.listado';
import { format, isAfter } from 'date-fns';
import { preBorrarNoticiaEdicion } from '../../../redux/api/noticiasGestion/noticiasGestionSlice.edicion';
import BoxErrorApi from '../../../navegacion/BoxErrorApi';

const MiniaturaGestionNoticia = ({ noticia }) => {

	const dispatch = useDispatch();
	const [open, setOpen] = React.useState(false);
	const [borrando, setBorrando] = React.useState(false);


	const borrarNoticia = React.useCallback((idNoticia) => {
		dispatch(preBorrarNoticiaEdicion({ idNoticia }));
		setBorrando(true);
		setTimeout(() => {
			setOpen(false);
			setBorrando(false);
			// ME ODIO
			dispatch(preBusquedaNoticias({
				orden: { fechaCreacion: 'desc' },
				offset: 0,
				limit: 50,
				formato: 'metadatos',
			}))
		}, 1000)
	}, [dispatch,])

	// let fechaCreacion = new Date(noticia.fechaCreacion);
	let fechaPublicacion = noticia.fechaPublicacion ? new Date(noticia.fechaPublicacion) : new Date(noticia.fechaCreacion);
	let fechaExpiracion = noticia.fechaExpiracion  ? new Date(noticia.fechaExpiracion) : null;

	let estado = { color: 'red', texto: '??' };
	if (noticia.estado === 'activa') {
		estado = { color: '#99cc99', texto: 'Publicada' };

		if (fechaPublicacion && isAfter(fechaPublicacion, new Date())) {
			estado = { color: '#9999cc', texto: 'Programada' };
		}
		if (fechaExpiracion && isAfter(new Date(), fechaExpiracion)) {
			estado = { color: '#cc9999', texto: 'Expirada' };
		}
	}
	else if (noticia.estado === 'archivada') {
		estado = { color: '#cccc99', texto: 'Archivada' };
	}
	else /*if (noticia.estado === 'borrador')*/ {
		estado = { color: '#cccccc', texto: 'Borrador' };
	}

	return <Paper square elevation={2} sx={{ px: 4, py: 2, mb: 3, borderLeftWidth: 8, borderLeftStyle: 'solid', borderLeftColor: estado.color }}>
		<Grid container >
			<Grid item xs={12} md={9}>
				<Typography variant="caption">{noticia.categoria}</Typography>
				<Typography variant="h6">{noticia.titulo}</Typography>
				<Typography variant="body2" sx={{ mt: 0.2, display: 'block', color: estado.color }}>{estado.texto}</Typography>
				{(fechaPublicacion && estado.texto !== 'Expirada') && <Box><Typography variant="caption" sx={{ fontWeight: 'bold' }}>
					{estado.texto === 'Programada' ? 'Se publicará el ' : 'Se publicó el '}
				</Typography>
					<Typography variant="caption">
						{format(fechaPublicacion, 'dd/MM/yyyy HH:mm')}
					</Typography>
				</Box>}
				{fechaExpiracion && <Box><Typography variant="caption" sx={{ fontWeight: 'bold' }}>
					{estado.texto === 'Expirada' ? 'Expiró el ' : 'Expirará el '}
				</Typography>
					<Typography variant="caption">
						{format(fechaExpiracion, 'dd/MM/yyyy HH:mm')}
					</Typography>
				</Box>}
			</Grid>
			<Grid item md={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>


				<Button variant="outlined" color="info" startIcon={<CreateOutlinedIcon />} sx={{ mb: 1 }} component={Link} to={'/noticias/gestion/e/' + noticia.id}>
					Editar
				</Button>
				<Button variant="outlined" color="error" startIcon={<DeleteOutlineOutlinedIcon />} sx={{ mb: 1 }} onClick={() => setOpen(true)}>
					Eliminar
				</Button>
			</Grid>
		</Grid>

		<Dialog
			fullWidth
			open={open}
			onClose={() => setOpen(false)}
			aria-labelledby={`dialog-title-${noticia.id}`}
			aria-describedby={`dialog-description-${noticia.id}`}
		>
			<DialogTitle id={`dialog-title-${noticia.id}`} >
				¿Seguro que quieres borrar la noticia?
			</DialogTitle>
			<DialogContent>
				<DialogContentText id={`dialog-description-${noticia.id}`}>
					<Typography>Se dispone a eliminar la siguiente noticia:</Typography>
					<Typography variant="h6">{noticia.titulo}</Typography>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button disabled={borrando} color="info" startIcon={<CloseIcon />} onClick={() => setOpen(false)} autoFocus>Cancelar</Button>
				<Button disabled={borrando} color="error" startIcon={borrando ? <CircularProgress size={20} color="secondary" /> : <DeleteOutlineOutlinedIcon />} onClick={() => borrarNoticia(noticia.id)} >Eliminar</Button>
			</DialogActions>
		</Dialog>

	</Paper >
}



export default function PantallaGestionNoticias() {

	const dispatch = useDispatch();
	const estadoConsultaNoticias = useSelector(state => state.noticiasGestion.listado.estado);
	const noticias = useSelector(state => state.noticiasGestion.listado.resultado);
	const error = useSelector(state => state.noticiasGestion.listado.error);

	React.useEffect(() => {
		dispatch(preBusquedaNoticias({
			orden: { fechaPublicacion: 'desc' },
			offset: 0,
			limit: 50,
			formato: 'metadatos'
		}))
	}, [dispatch])

	let contenido = null;

	if (estadoConsultaNoticias === "cargando") {
		contenido = <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
			<CircularProgress size={40} />
			<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Consultando ...</Typography>
		</Box>
	} else if (error) {
		contenido = <BoxErrorApi msError={error} titulo="Ocurrió un error al realizar la consulta" />
	} else if (noticias?.length > 0) {
		contenido = <Stack sx={{ mt: 2 }}>
			{noticias.map(noticia => {
				return <MiniaturaGestionNoticia key={noticia.id} noticia={noticia} />
			})}
		</Stack>
	} else {
		contenido = <Box sx={{ m: 'auto', textAlign: 'center' }}>
			<div><SentimentNeutralIcon sx={{ width: '60px', height: '60px', color: 'secondary.light' }} /></div>
			<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Sin resultados</Typography>
		</Box>
	}

	return <>
		<Box sx={{ m: 'auto' }}>
			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Gestión de noticias</Typography>
		</Box>

		<Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
			<Button variant="contained" color="success" size="large" startIcon={<AddCircleOutlineOutlinedIcon />} sx={{ mb: 1 }} component={Link} to={'/noticias/gestion/a'}>
				Nueva noticia
			</Button>
		</Box>

		{contenido}

	</>


}