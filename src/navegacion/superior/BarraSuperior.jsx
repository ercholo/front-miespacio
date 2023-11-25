import {memo, useState, useCallback} from 'react';
import PropTypes from 'prop-types';

// MUI
import { AppBar, Toolbar, Typography, IconButton }  from '@mui/material/';

// ICONOS
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';

// REDUX
import { useSelector } from 'react-redux';

// SUBCOMPONENTES
import MenuUsuario from './MenuUsuario';
import { redux_usuario_select_Usuario } from '../../redux/usuario/usuarioSlice';


const BarraSuperior = memo(({ onMenuLateralClick }) => {
	
	const usuario = useSelector(redux_usuario_select_Usuario);
	const tituloPantalla = useSelector(state => state.pantalla.titulo);

	const [anclaje, setAnclaje] = useState(null);
	const fnAbrirMenuUsuario = useCallback((e) => setAnclaje(e.currentTarget), [setAnclaje]);
	const fnCerrarMenuUsuario = useCallback(() => setAnclaje(null), [setAnclaje]);

	const fnIrSuccessFactors = () => {
		window.location.href = 'https://portalempleado.hefame.es';
	}

	return (
		<AppBar position="fixed" >
			<Toolbar>
				{usuario && (
					<IconButton edge="start" sx={{ mr: 4 }} color="inherit" onClick={onMenuLateralClick}>
						<MenuIcon />
					</IconButton>
				)}

				<Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.contrastText' }}>
					{tituloPantalla}
				</Typography>

				{usuario &&
					<MenuUsuario
						elementoAncla={anclaje}
						abierto={Boolean(anclaje)}
						fnCerrarMenuUsuario={fnCerrarMenuUsuario}
						fnAbrirMenuUsuario={fnAbrirMenuUsuario}
					/>
				}

				<IconButton onClick={fnIrSuccessFactors} color="inherit" >
					<FavoriteIcon sx={{ color: 'error.main' }} />
				</IconButton>
				
			</Toolbar>
		</AppBar>
	);
});

BarraSuperior.propTypes = {
    onMenuLateralClick: PropTypes.func
}

BarraSuperior.displayName = 'BarraSuperior';
export default BarraSuperior