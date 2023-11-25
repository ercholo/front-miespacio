import { Avatar, Box, Button, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAutorizacion } from "hooks/useAutorizacion";
//import FavoriteIcon from "@mui/icons-material/Favorite";
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
export default function PanelNotificaciones() {
	const navigate = useNavigate();
	const autorizacionEncuesta = useAutorizacion({
		subdivisionPersonal: [
			"ALBA",
			"ALIC",
			"ALME",
			"BARC",
			"BFPA",
			"CART",
			"GERO",
			"GETA",
			"GRAN",
			"MALA",
			"SANT",
			"TARR",
			"VALE",
			"FISA",
			"FISE",
			"HFAB",
			"FMAL",
			"FMBA",
			"FMGT",
			"FMSA",
			"FMTA",
			"FMVA",
			"MADR",
			"STEG",
			"TORT",
			"FMSM",
			"SSSM",
			"HCSA",
			"HFAL",
			"HFAM",
			"HFBA",
			"HFCA",
			"HFGR",
			"HFGT",
			"HFMA",
			"HFSA",
			"HFVA",
			"HFMD",
			"HFGE",
			"HFRB",
			"HFTO",
			"HFME",
			"HFPA",
			"RIBA",
			"HICC",
			"HIMD",
			"HISA",
			"IHSA",
			"ITSA",
			"OISA",
			"OLGR",
			"PRSA",
			"RGBA",
			"RGGT",
			"RGSA",
			"SMSA",
			"UCMD",
			"USMD",
			"UXSA",
			"OLBA",
			"OLSA",
			"OLMD",
		],
	});

	if (!autorizacionEncuesta) return null;

	return (
		<Paper elevation={3} sx={{ mb: 4 }}>
			<Box sx={{ background: (t) => t.palette.primary.light, my: 0, py: 1.2, pl: 3 }}>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Box sx={{ mr: 2, display: "flex" }}>
						<NotificationsNoneOutlinedIcon />
					</Box>
					<Box>
						<Typography variant="h6">Notificaciones</Typography>
					</Box>
				</Box>
			</Box>

			<Box sx={{ my: 0, py: 0, px: 2, mb: 1 }}>
				<ListItem alignItems="flex-start">
					<ListItemAvatar>
						<Avatar sx={{ bgcolor: "success.light" }}>
							<FamilyRestroomIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary="HEFAMily's Day llega para que tu familia y tú seáis los protagonistas."
						secondary={
							<>
								<Typography component="div" variant="body2">
									El domingo 17 de septiembre Hefame te invita a compartir con tus seres queridos y tus compañer@s una jornada, en familia, de diversión y celebración. ¡Os esperamos!
								</Typography>
								<Button
									sx={{ my: 2 }}
									variant="contained"
									color="secondary"
									onClick={() => navigate("/encuestas/649c37ab891e9d4bf6dea870")}
								>
									Formulario de inscripción
								</Button>
							</>
						}
					/>
				</ListItem>
			</Box>
		</Paper>
	);
}
