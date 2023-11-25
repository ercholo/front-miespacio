import { Box, Checkbox, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DialogNormativaViajes from "./DialogNormativaViajes";


export const PasoInicial = ({ dispatcher, aceptaNormativa }) => {
	return <Box>
		<Typography variant="h6" sx={{ mb: 2 }}>Antes de comenzar</Typography>
		<Typography>
			En caso de realizar un desplazamiento por motivos de trabajo, ponte en contacto con el Inplant de la Agencia de Viajes El Corte Inglés para conocer y elegir la mejor opción:
		</Typography>
		<List
			sx={{ width: '100%', bgcolor: 'background.paper' }}
			component="nav"
			aria-labelledby="nested-list-subheader"
		>


			<ListItem>
				<ListItemIcon>
					<EmailOutlinedIcon />
				</ListItemIcon>
				<ListItemText
					secondary="Email"
					primary={<>
						<Typography component="span" variant="body1" sx={{ fontWeight: 'bold' }}>hefame@viajeseci.es</Typography>
					</>}
				/>
			</ListItem>

			<ListItem>
				<ListItemIcon>
					<LocalPhoneOutlinedIcon />
				</ListItemIcon>
				<ListItemText
					secondary="Teléfono"
					primary={<>
						<Typography component="span" variant="body1" sx={{ fontWeight: 'bold' }}>968 277 506</Typography>
						<Typography component="span" variant="body2"> ext. </Typography>
						<Typography component="span" variant="body1" sx={{ fontWeight: 'bold' }}>33601 y 33602</Typography>
					</>}
				/>
			</ListItem>

			<ListItem>
				<ListItemIcon>
					<SupportAgentIcon />
				</ListItemIcon>
				<ListItemText
					secondary="Servicio de urgencia: de lunes a viernes desde 18.00 a 09.00h, sábado y domingo 24h"
					primary={<>
						<Typography variant="body1" sx={{ fontWeight: 'bold' }}>912 183 926</Typography>
					</>}
				/>
			</ListItem>

		</List>
		<Typography variant="body1" gutterBottom>
			Una vez conozcas los detalles del viaje, deberás realizar la solicitud a través del siguiente formulario digital para que la agencia pueda emitir las reservas de transporte y/o alojamiento.
		</Typography>
		<Typography variant="body1">
			Recuerda que sin esta solicitud digital, la agencia no podrá tramitar tu viaje, salvo que se trate de una emergencia.
		</Typography>

		<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
			<FormControlLabel
				control={<Checkbox
					color="secondary"
					checked={aceptaNormativa}
					onChange={(e) => dispatcher('setAceptaNormativa', e.target.checked)}
				/>}
				label={<>
					He leído y acepto la <DialogNormativaViajes />.
				</>}
			/>
		</Box>



	</Box>
}