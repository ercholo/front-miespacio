import React from "react";

import { Typography, Container, Button, Box } from "@mui/material";

import FavoriteIcon from '@mui/icons-material/Favorite';
import LoginIcon from '@mui/icons-material/Login';

import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { redux_usuario_logout, redux_usuario_select_EstadoInicializacion } from "../redux/usuario/usuarioSlice";


export default function PantallaLogout() {

	const dispatch = useDispatch();
	const [, , removeCookie] = useCookies(['empleado_sessid']);
	const estadoLogin = useSelector(redux_usuario_select_EstadoInicializacion);

	React.useEffect(() => {
		if (estadoLogin.estado !== 'logout') {
			removeCookie('empleado_sessid');
			dispatch(redux_usuario_logout());
		}
	}, [estadoLogin.estado, dispatch, removeCookie])



	return (
		<Container maxWidth="sm">

			{/*<CardMedia
						component="img"
						image="/img/successfactorlogo.png"
						alt="SuccessFactors"
						sx={{ px: 2, mt: 6, mb: 2 }}
					/>*/}
			<Box>
				<Typography variant="h5">
					{estadoLogin.estado === 'logout' ? 'Se ha cerrado su sesión en Tu Espacio' : 'Su sesión ha caducado, vuelva a identificarse.'}
				</Typography>
			</Box>

			<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mt: 5 }}>
				<Button
					variant="contained" size="large" color="primary" href="https://empleado.hefame.es/ssf/login"
					sx={{ width: '90%', py: 1, mx: 1, fontSize: '120%', fontWeight: 'bold' }}
					startIcon={<LoginIcon />}>
					Identificarse
				</Button>

				<Button
					variant="contained" size="large" color="primary" href="https://portalempleado.hefame.es"
					sx={{ width: '90%', py: 1, mx: 1, fontSize: '120%', fontWeight: 'bold', mt: { xs: 2, md: 0 } }}
					startIcon={<FavoriteIcon sx={{ color: 'error.main' }} />}>
					SuccessFactors
				</Button>
			</Box>

		</Container>
	)



}