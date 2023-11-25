import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { TIPOS_VIAJE } from "./Pasos"



export const PasoGeneral = ({ dispatcher, motivo, tipo, pep, fechaSolicitud, solicitante }) => {
	return <Box>
		<Typography variant="h6" sx={{ mb: 2 }}>Datos generales del viaje</Typography>
		<TextField
			//disabled={actualizando}
			color="secondary"
			variant="outlined"
			label="Motivo del viaje"
			required
			defaultValue={motivo}
			helperText="Por exigencias fiscales, especifique de forma detallada el motivo del viaje."
			error={!Boolean(motivo.trim())}
			onChange={(e) => dispatcher('setMotivo', e.target.value)}
			sx={{ my: 2, width: '100%' }}
		/>
		<FormControl variant="outlined" sx={{ mr: 2, my: 2 }}>
			<InputLabel id="tipoViaje-label" color="secondary">Tipo de viaje</InputLabel>
			<Select
				//disabled={actualizando}
				required
				labelId="tipoViaje-label"
				value={tipo}
				onChange={(e) => dispatcher('setTipo', e.target.value)}
				label="Tipo de viaje"
				color="secondary"
				sx={{ width: '30ch' }}
			>
				{TIPOS_VIAJE.map(tipo => <MenuItem key={tipo.clave} value={tipo.clave}>{tipo.texto}</MenuItem>)}
			</Select>
		</FormControl>
		<TextField
			//disabled={actualizando}
			color="secondary"
			variant="outlined"
			label="Elemento PEP"
			helperText="Plan de Estructura de Proyecto. Indicar solamente si existe el proyecto específico en SAP."
			defaultValue={pep}
			onChange={(e) => dispatcher('setPep', e.target.value)}
			sx={{ mt: 2, mb: 4, width: '100%' }}
		/>
		{/*}
		<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} sx={{ my: 2 }}>
			<DatePicker
				//disabled={actualizando}
				label="Fecha de solicitud"
				renderInput={(params) => <TextField {...params} onKeyDown={(e) => e.preventDefault()} />}
				value={fechaSolicitud}
				onChange={(nuevaFecha) => { dispatcher('setFechaSolicitud', nuevaFecha) }}
			/>
		</LocalizationProvider>
		<TextField
			//disabled={actualizando}
			color="secondary"
			variant="outlined"
			label="Solicitante del viaje"
			defaultValue={solicitante}
			InputProps={{
				readOnly: true,
			}}
			// onChange={(e) => console.log(e.target.value)}
			sx={{ mt: 4, width: '100%' }}
		/>
		*/}
	</Box>
}