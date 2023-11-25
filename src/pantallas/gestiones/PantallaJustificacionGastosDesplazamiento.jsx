import { Box, Button, Typography } from "@mui/material";

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';

export default function PantallaJustificacionGastosDesplazamiento() {
	return <>
		<Box sx={{ m: 'auto' }}>
			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Justificación de Gastos por Desplazamiento</Typography>
		</Box>



		<Box sx={{ textAlign: { sm: 'justify' } }}>
			<Typography>
				Desde el 1 de febrero de 2020 la herramienta a través de la cual se gestiona la justificación es la <strong>App móvil DevoluIVA</strong>,
				que facilita el envío y aprobación de los gastos evitando el uso de papel y la mecanización manual de los tickets.
			</Typography>


			<Button variant="outlined" color="secondary" startIcon={<DownloadIcon />} sx={{ mt: 2, mx: 'auto' }}>
				Normativa de Justificación de gastos (vigente desde 01/02/2020)
			</Button>
			<Typography></Typography>
			<Button variant="outlined" color="secondary" endIcon={<OpenInNewIcon />} sx={{ mb: 4, mt:1, mx: 'auto' }}>
				Manual uso App DevoluIVA
			</Button>

			<Box sx={{ height: { xs: '180px', sm: '260px', md: '300px' }, textAlign: "center" }}>
				<img src="/img/gastos.jpg" alt="Justificación de Gastos" style={{ height: '100%' }} />
			</Box>

			<Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
				Preguntas frecuentes
			</Typography>
			<Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
				¿Qué hago si tengo un ticket de fecha anterior al 1 de febrero de 2020?
			</Typography>
			<Typography>
				Debes tramitarlo con el procedimiento tradicional. Rellena este formulario, fírmalo y entrégalo junto al ticket a tu responsable para su validación.
			</Typography>
			<Button variant="outlined" color="secondary" startIcon={<DownloadIcon />} sx={{ my: 2, mx: 'auto' }}>
				Formulario de justificación de gastos
			</Button>


			<Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
				Hace mucho tiempo o nunca he tramitado gastos, ¿dónde me dirijo para solicitar el acceso a DevoluIVA?
			</Typography>
			<Typography>
				Si tienes correo corporativo, envía un email a <strong>farmacuenta@hefame.es</strong> solicitando el acceso.
				En un breve espacio de tiempo te llegará un email con la invitación a la herramienta.
			</Typography>
			<Typography>
				Si no tienes asignado correo corporativo, puedes usar una dirección de correo personal.
				Cumplimenta este formulario y hazlo llegar a <strong>departamento.personal@hefame.es</strong>.
			</Typography>

			<Button variant="outlined" color="secondary" startIcon={<DownloadIcon />} sx={{ my: 2, mx: 'auto' }}>
				Formulario de solicitud de acceso a DevoluIVA
			</Button>

		</Box>
	</>
}