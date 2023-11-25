import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// import Icon from "@mui/material/Icon";
import { Icon, Box, Collapse, Typography, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material/";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Link } from "react-router-dom";
import { useAutorizacion } from '../../hooks/useAutorizacion';

export const BotonDeMenuLateral = ({ texto, icono, link, onClick, subMenu, esTitulo, fnCerrarDrawer, autorizacion }) => {


	const autorizado = useAutorizacion(autorizacion)
	const [menuAbierto, setMenuAbierto] = useState(false);

	const cambiaEstadoMenu = useCallback(() => {
		if (!subMenu) return;
		setMenuAbierto(!menuAbierto);
	}, [subMenu, menuAbierto, setMenuAbierto])

	if (!autorizado) return null;

	if (esTitulo) {
		return (
			<ListSubheader disableSticky sx={{ bgcolor: 'primary.light' }}>
				<Typography variant="overline" component="div" sx={{ pb: 0, mb: 0, py: 0.6, color: 'text.primary', fontSize: '110%', fontWeight: 'bold' }}>
					{texto}
				</Typography>
			</ListSubheader>
		);
	}


	let propiedades = {};

	if (link && !subMenu) {
		propiedades.component = Link;
		propiedades.to = link;
	}

	let elementoSubMenu = null;

	if (subMenu) {
		if (onClick) {
			propiedades.onClick = () => {
				cambiaEstadoMenu();
				onClick();
			}
		}
		else {
			propiedades.onClick = cambiaEstadoMenu;
		}

		elementoSubMenu =
			(
				<Collapse in={menuAbierto} timeout="auto" unmountOnExit>
					<Box paddingLeft={3}>
						{subMenu.map((propiedadesSubMenu, i) => (
							<BotonDeMenuLateral key={i} fnCerrarDrawer={fnCerrarDrawer} {...propiedadesSubMenu} />
						))}
					</Box>
				</Collapse>
			)
	} else {
		if (onClick) {
			propiedades.onClick = () => {
				onClick()
				fnCerrarDrawer();
			}
		} else {
			propiedades.onClick = () => {
				fnCerrarDrawer();
			}
		}
	}

	return (
		<Box>
			<ListItemButton {...propiedades} >
				<ListItemIcon sx={{ px: 1.5 }}>
					<Icon component={icono} />
				</ListItemIcon>
				<ListItemText primary={texto} sx={{ color: 'text.primary' }} />
				{subMenu && (menuAbierto ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
			</ListItemButton>
			{elementoSubMenu}
		</Box>
	)
}

BotonDeMenuLateral.propTypes = {
	texto: PropTypes.string,
	icono: PropTypes.elementType,
	link: PropTypes.string,
	onClick: PropTypes.func,
	subMenu: PropTypes.arrayOf(PropTypes.object),
	esTitulo: PropTypes.bool,
	fnCerrarDrawer: PropTypes.func,
	autorizacion: PropTypes.object,
};