import { useNavigate } from 'react-router';

// MUI
import PropTypes from 'prop-types';

import { IconButton, MenuItem, Menu, ListItemIcon } from '@mui/material/';

// ICONOS
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const MenuUsuario = ({ elementoAncla, abierto, fnCerrarMenuUsuario, fnAbrirMenuUsuario }) => {

	const navigate = useNavigate();

	const fnRealizarLogout = () => {
		fnCerrarMenuUsuario();
		navigate('/logout');
	}

	return (
		<div>
			<IconButton
				onClick={fnAbrirMenuUsuario}
				color="inherit"
			>
				<AccountCircleIcon />
			</IconButton>

			<Menu
				anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
				transformOrigin={{ vertical: 'top', horizontal: 'right', }}
				keepMounted
				open={abierto}
				anchorEl={elementoAncla}
				onClose={fnCerrarMenuUsuario}
			>
				<MenuItem onClick={fnRealizarLogout}>
					<ListItemIcon>
						<ExitToAppRoundedIcon fontSize="small" />
					</ListItemIcon>
					Cerrar sesión
				</MenuItem>

			</Menu>
		</div>
	)
}

MenuUsuario.propTypes = {
	elementoAncla: PropTypes.object,
	abierto: PropTypes.bool,
	fnCerrarMenuUsuario: PropTypes.func,
	fnAbrirMenuUsuario: PropTypes.func,
};
