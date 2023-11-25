import React from "react";
// MUI
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";

// MUI-ICONS
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";


// REDUX
import { useSelector } from "react-redux";
import BotonDeMenuLateral from "./BotonDeMenuLateral";
import botones from "./botones";

import './daleVueltas.css'
import { redux_usuario_select_Usuario } from "../../redux/usuario/usuarioSlice";


const obtenerMemeRandom = () => {
	let items = ['ancient-aliens-crazy-history-channel-guy', 'jackie-chan-why', 'cool_jesus', 'skeptical_dog', 'vincent_van_no_grumpy_cat', 'rainbow-spongbob', 'you-complete-me-', 'doge', 'futurama_fry', 'donald-trump', 'sarcastic_nicholas_cage', 'business_cat']
	let meme = items[Math.floor(Math.random() * items.length)];
	return `url('https://makeameme.org/media/templates/120/${meme}.jpg')`
}


const DrawerLateral = ({ abierto, fnCerrar, fnAbrir }) => {

	let usuario = useSelector(redux_usuario_select_Usuario);
	let [friki, setFriki] = React.useState(false)

	if (!usuario) return null;

	return <SwipeableDrawer anchor="left" open={abierto} onClose={fnCerrar} onOpen={fnAbrir} disableSwipeToOpen={usuario ? null : true}	>
		<Box sx={{ bgcolor: 'primary.main', minWidth: '380px' }}>
			<IconButton onClick={fnCerrar} sx={{ my: 1.6, ml: 1, mr: 2, position: 'absolute' }}>
				<ChevronLeftIcon sx={{ fontSize: '38px', color: "primary.contrastText" }} />
			</IconButton>

			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
				<Box sx={{
					m: 'auto',
					width: 150,
					height: 150,
					borderRadius: '50%',
					backgroundImage: friki ? obtenerMemeRandom() : `url('https://empleado.hefame.es/rest/v1/empleados/foto')`,
					backgroundPosition: 'center 0',
					backgroundSize: friki ? '170px 180px' : '130px 150px',
				}}
					onClick={() => [92409705, 90202335].includes(usuario.codigoEmpleado) && setFriki(f => !f)}
					className={[92409705, 90202335].includes(usuario.codigoEmpleado) && "gira"}
				/>
				<Box sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Typography variant="h5" component="div" sx={{ color: "primary.contrastText", textTransform: 'capitalize', fontWeight: 'bold' }}>{usuario.nombre}</Typography>
					<Typography variant="h6" component="div" sx={{ color: "primary.contrastText", textTransform: 'capitalize' }}>{usuario.apellidos}</Typography>
					<Typography variant="caption" component="div" sx={{ color: "primary.contrastText", }}>{usuario.codigoEmpleado}</Typography>
				</Box>
				{/*
				<Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />} sx={{ mb: 2 }}>
					<IconButton color="inherit"	>
						<Badge badgeContent={0} color="secondary">
							<BadgeOutlinedIcon />
						</Badge>
					</IconButton>

					<IconButton color="inherit">
						<Badge badgeContent={4} color="secondary">
							<NewspaperIcon />
						</Badge>
					</IconButton>

					<IconButton color="inherit"	>
						<Badge badgeContent={0} color="secondary">
							<NotificationsIcon />
						</Badge>
					</IconButton>

					<IconButton color="inherit"	>
						<Badge badgeContent={1} color="secondary">
							<PollOutlinedIcon />
						</Badge>
					</IconButton>

				</Stack>
*/}
			</Box>

		</Box>

		<List>
			{botones.map((boton, i) => <BotonDeMenuLateral key={i} fnCerrarDrawer={fnCerrar} {...boton} />)}
		</List>
	</SwipeableDrawer>

}


export default React.memo(DrawerLateral)