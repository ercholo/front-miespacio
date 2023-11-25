import React from 'react';

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Icon from "@mui/material/Icon";
import ListItemButton from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Link } from "react-router-dom";
import { Typography } from '@mui/material';
import useAutorizacion from '../../hooks/useAutorizacion';



export default function BotonDeMenuLateral({ texto, icono, link, onClick, subMenu, esTitulo, fnCerrarDrawer, autorizacion }) {


	const autorizado = useAutorizacion(autorizacion)
	const [menuAbierto, setMenuAbierto] = React.useState(false);
	const cambiaEstadoMenu = React.useCallback(() => {
		if (!subMenu) return;
		setMenuAbierto(!menuAbierto);
	}, [subMenu, menuAbierto, setMenuAbierto])

	if (!autorizado) return null;

	if (esTitulo) {
		return <ListSubheader disableSticky sx={{ bgcolor: 'primary.light' }}>
			<Typography variant="overline" component="div" sx={{ pb: 0, mb: 0, py: 0.6, color: 'text.primary', fontSize: '110%', fontWeight: 'bold' }}>
				{texto}
			</Typography>
		</ListSubheader>
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

		elementoSubMenu = <Collapse in={menuAbierto} timeout="auto" unmountOnExit>
			<Box paddingLeft={3}>
				{subMenu.map((propiedadesSubMenu, i) => <BotonDeMenuLateral key={i} fnCerrarDrawer={fnCerrarDrawer} {...propiedadesSubMenu} />)}
			</Box>
		</Collapse>

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
