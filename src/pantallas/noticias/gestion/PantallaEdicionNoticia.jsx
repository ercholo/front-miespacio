import React from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


import { preConsultaNoticiaEdicion } from '../../../redux/api/noticiasGestion/noticiasGestionSlice.edicion';
import FormularioEdicionNoticia from './FormularioEdicionNoticia';
import { Link } from 'react-router-dom';
import { BoxErrorApi } from '../../../navegacion/BoxErrorApi';

export default function PantallaEdicionNoticia() {

	let { idNoticia } = useParams();


	const dispatch = useDispatch();
	const estadoConsultaNoticia = useSelector(state => state.noticiasGestion.editor.consulta.estado);
	const noticia = useSelector(state => state.noticiasGestion.editor.consulta.resultado);
	const error = useSelector(state => state.noticiasGestion.editor.consulta.error);

	React.useEffect(() => {
		dispatch(preConsultaNoticiaEdicion({ idNoticia, formato: 'completo' }))
	}, [dispatch, idNoticia])

	let contenido = null;

	if (estadoConsultaNoticia === "cargando") {
		contenido = <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
			<CircularProgress size={40} />
			<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Consultando datos de la noticia ...</Typography>
		</Box>
	} else if (error) {
		contenido = <BoxErrorApi msError={error} titulo="Ocurrió un error al realizar la consulta" />
	} else if (noticia) {
		contenido = <FormularioEdicionNoticia noticia={noticia} />
	} else {
		contenido = <Box sx={{ m: 'auto', textAlign: 'center' }}>
			<div><SentimentNeutralIcon sx={{ width: '60px', height: '60px', color: 'secondary.light' }} /></div>
			<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">No se encuentra la noticia</Typography>
		</Box>
	}



	return <>
		<Box sx={{ m: 'auto' }}>
			<Button variant="outlined" color="info" startIcon={<ArrowBackIcon />} sx={{ mb: 1 }} component={Link} to={'/noticias/gestion'}>
				Volver al listado de noticias
			</Button>

			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Editar noticia</Typography>
		</Box>
		{contenido}
	</>


}