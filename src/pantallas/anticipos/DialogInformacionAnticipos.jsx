import React from "react";

import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery } from "@mui/material";

import HelpIcon from "@mui/icons-material/Help";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@emotion/react";

export default function DialogInformacionAnticipos() {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
	const [abierto, setAbierto] = React.useState(false);

	return (
		<>
			<Button variant="outlined" color="info" onClick={() => setAbierto(true)} startIcon={<HelpIcon />} sx={{ m: 1 }} size="large">
				Acerca de los Anticipos
			</Button>

			<Dialog fullScreen={fullScreen} fullWidth maxWidth="lg" open={abierto} onClose={() => setAbierto(false)}>
				<DialogTitle sx={{ m: 0, mb: 0, py: 1, bgcolor: "primary.main", color: "primary.contrastText" }}>
					Acerca de los Anticipos
					<IconButton
						onClick={() => setAbierto(false)}
						sx={{ position: "absolute", right: 8, top: 4, color: (t) => t.palette.grey[800] }}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent sx={{ px: 6, mt: { xs: 3, sm: 6 }, textAlign: { sm: "justify" } }}>
					<Typography>
						En base a su política de Recursos Humanos, Hefame facilita a los trabajadores el acceso a Beneficios sociales en
						forma de Anticipos.
					</Typography>
					<Typography>
						Los anticipos solicitados entre el día 15 del mes anterior y el 14 del mes corriente, se autorizan el día 15 o día
						laborable siguiente.
					</Typography>
					<Alert severity="info" sx={{ my: 2 }}>
						Si tienes alguna duda o incidencia de la que informar, puedes ponerte en contacto con Recursos Humanos en el
						teléfono <strong>968 277 505</strong> o por correo electrónico al e-mail{" "}
						<strong>departamento.personal@hefame.es</strong>.
					</Alert>
					<Typography>A continuación se exponen las características de cada uno recogidas en el Convenio Colectivo:</Typography>

					<Typography variant="h6" component="div" sx={{ mt: 2 }}>
						Anticipo sobre la nómina del mes corriente
					</Typography>
					<Typography>
						La cantidad máxima será el líquido devengado en los días transcurridos del mes. Se descontará de una única vez en la
						nómina del mes corriente.
					</Typography>

					<Typography variant="h6" component="div" sx={{ mt: 2 }}>
						Anticipo sobre la paga extraordinaria de beneficios
					</Typography>
					<Typography>
						La cantidad máxima será el líquido devengado correspondiente a los meses transcurridos desde el día 1 de enero del
						año en curso hasta la fecha de solicitud. Se descontará de una única vez en la paga extraordinaria de beneficios.
					</Typography>

					<Typography variant="h6" component="div" sx={{ mt: 2 }}>
						Anticipo sobre la paga extraordinaria de verano
					</Typography>
					<Typography>
						La cantidad máxima será el líquido devengado correspondiente a los meses transcurridos desde el día 1 de julio hasta
						la fecha de solicitud. Se descontará de una única vez en la paga extraordinaria de verano.
					</Typography>

					<Typography variant="h6" component="div" sx={{ mt: 2 }}>
						Anticipo sobre la paga extraordinaria de Navidad
					</Typography>
					<Typography>
						La cantidad máxima será el líquido devengado correspondiente a los meses transcurridos desde el día 1 de enero del
						año en curso hasta la fecha de solicitud. Se descontará de una única vez en la paga extraordinaria de Navidad.
					</Typography>

					<Typography variant="h6" component="div" sx={{ mt: 2 }}>
						Anticipo de Empresa
					</Typography>
					<Typography>
						Anticipo a devolver en un máximo de 36 meses. Su importe máximo será el correspondiente a cinco veces los siguientes
						conceptos retributivos: Salario Base, Complemento Ad Personam, Complemento Ad Personam No Reducible, Plus de
						Nocturnidad, Plus de Actividad y Valor en Especie.
					</Typography>

					<Typography component="div" sx={{ mt: 2 }}>
						Para acceder a este Anticipo será necesario tener contrato indefinido y una antigüedad mínima de 1 año.
					</Typography>

				</DialogContent>
				<DialogActions sx={{ px: 4, mb: 2 }}>
					<Button onClick={() => setAbierto(false)} color="secondary" variant="outlined" startIcon={<CloseIcon />}>
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
