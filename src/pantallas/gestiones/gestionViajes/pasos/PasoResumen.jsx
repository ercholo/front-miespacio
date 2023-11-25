import { TextField, Typography, Box, Divider } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale"
import { MEDIOS_TRANSPORTE, TIPOS_VIAJE } from "./Pasos";


export const PasoResumen = ({
	dispatcher,
	motivo, tipo, pep,
	numeroViajeros, datosViajeros,
	medioTransporte, fechaViaje, origen, destino, horaSalida, horaLlegada,
	numeroHoteles, datosHoteles,
	observaciones, email
}) => {

	const BoxItemResumen = ({ texto, valor }) => {
		return <Box sx={{ mb: 2 }}>
			<Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '75%' }}>{texto}</Typography>
			<Box sx={{ ml: 4 }}>{valor}</Box>
		</Box>
	}

	return <Box>
		<Typography variant="h6" sx={{ mb: 2 }}>Resumen de la solicitud</Typography>

		<Typography variant="overline" component="div">DATOS GENERALES</Typography>
		<Divider sx={{ mb: 1 }} />
		<BoxItemResumen valor={motivo} texto="Motivo del viaje" />
		<BoxItemResumen valor={TIPOS_VIAJE.find(t => t.clave === tipo)?.texto} texto="Tipo de viaje" />
		{pep && <BoxItemResumen valor={pep} texto="Elemento PEP" />}

		<Typography variant="overline" component="div" sx={{ mt: 2 }}>VIAJEROS</Typography>
		<Divider sx={{ mb: 1 }} />
		{
			datosViajeros.filter((_, i) => i < numeroViajeros).map((viajero, i) =>
				<Typography key={i} sx={{ ml: 4 }}><b>{i + 1}</b>. {viajero.nombre} ({viajero.centroCoste})</Typography>
			)
		}

		<Typography variant="overline" component="div" sx={{ mt: 4 }}>TRANSPORTE</Typography>
		<Divider sx={{ mb: 1 }} />

		<BoxItemResumen valor={MEDIOS_TRANSPORTE.find(t => t.clave === medioTransporte)?.texto} texto="Medio de transporte" />
		{medioTransporte !== 'propio' && <>
			<BoxItemResumen valor={`${format(fechaViaje, "cccc, dd' de 'LLLL' de 'yyyy", { locale: es })}, con salida a las ${format(horaSalida, "HH:mm", { locale: es })}`} texto="Fecha de viaje" />
			<BoxItemResumen texto="Trayecto" valor={<>
				<Box>
					<Typography variant="body2" component="div" sx={{ display: 'inline-block', minWidth: '10ch' }}>Origen</Typography>
					<Typography variant="body2" component="div" sx={{ display: 'inline-block', fontWeight: 'bold' }}> ➜ {origen}</Typography>
				</Box>
				<Box>
					<Typography variant="body2" component="div" sx={{ display: 'inline-block', minWidth: '10ch' }}>Destino</Typography>
					<Typography variant="body2" component="div" sx={{ display: 'inline-block', fontWeight: 'bold' }}> ➜ {destino}</Typography>
				</Box>

			</>} />
		</>}
		{numeroHoteles > 0 && <>
			<Typography variant="overline" component="div" sx={{ mt: 4 }}>HOTELES</Typography>
			<Divider sx={{ mb: 1 }} />

			{
				datosHoteles.filter((_, i) => i < numeroHoteles).map((hotel, i) =>
					<Box key={i} sx={{ ml: 4, mt: 2 }}>
						<Typography variant="body2">
							{format(hotel.fechaEntrada, "cccc, dd' de 'LLLL' de 'yyyy", { locale: es })} ➜ {hotel.numeroNoches} noche{hotel.numeroNoches !== 1 && 's'}
							{(medioTransporte === 'propio' || medioTransporte === 'coche-alquiler') && hotel.solicitaParking && <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>, con parking.</Typography>}
						</Typography>
						<Typography variant="body1" sx={{ ml: 1, fontWeight: 'bold' }}>
							{hotel.nombre}
						</Typography>
						<Typography variant="caption" sx={{ ml: 1 }}>

						</Typography>
					</Box>
				)
			}
		</>}

		<TextField
			//disabled={actualizando}
			color="secondary"
			variant="outlined"
			label="Observaciones"
			defaultValue={observaciones}
			onChange={(e) => dispatcher('setObservaciones', e.target.value)}
			multiline
			rows={3}
			sx={{ my: 2, width: '100%' }}
		/>

		<TextField
			//disabled={actualizando}
			color="secondary"
			variant="outlined"
			label="Email de tu responsable"
			defaultValue={email}
			required
			error={!Boolean(email.trim())}
			helperText="Indica la dirección de tu responsable para que reciba copia de los datos de la solicitud"
			onChange={(e) => dispatcher('setEmail', e.target.value)}
			sx={{ my: 2, width: { xs: '100%', sm: '50ch' } }}
		/>

	</Box>
}
