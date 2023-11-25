import React from 'react';

import { BoxErrorApi } from '../../navegacion/BoxErrorApi';

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { redux_noticias_feedNext } from '../../redux/api/noticias/noticiasSlice';

import MiniaturaNoticia from './MiniaturaNoticia';
import './quill.css'


export default function FeedNoticias() {

	const dispatch = useDispatch();
	const estadoFeed = useSelector(state => state.noticias.estadoConsultaFeed.estado);
	const errorFeed = useSelector(state => state.noticias.estadoConsultaFeed.error);
	const feed = useSelector(state => state.noticias.feed);

	React.useEffect(() => {
		dispatch(redux_noticias_feedNext());
	}, [dispatch])

	let boxError = null;
	if (errorFeed) {
		boxError = <BoxErrorApi msError={errorFeed} titulo="Ocurrió un error al realizar la consulta" />
	}

	let boxCargando = null;
	if (estadoFeed === 'cargando') {
		boxCargando = <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
			<CircularProgress size={40} />
			<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Cargando ...</Typography>
		</Box>
	} else {
		boxCargando = <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
			<Button size="large" variant="outlined" color="secondary" onClick={() => dispatch(redux_noticias_feedNext())}>
				Cargar mas noticias
			</Button>
		</Box>
	}

	return <Box>
		{feed.map(noticia => <MiniaturaNoticia key={noticia.id} noticia={noticia} />)}
		{boxCargando}
		{boxError}
	</Box>


}