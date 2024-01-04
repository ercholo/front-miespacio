import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"
import { MEDIOS_TRANSPORTE } from "./Pasos"



export const PasoTransporte = ({ dispatcher, medioTransporte, fechaViaje, origen, destino, horaSalida, horaLlegada }) => {
	return <Box>
		<Typography variant="h6" sx={{ mb: 2 }}>Medio de transporte</Typography>
		<FormControl variant="outlined" sx={{ mr: 2, my: 2 }}>
			<InputLabel id="medioTransporte-label" color="secondary">Desplazamiento</InputLabel>
			<Select
				//disabled={actualizando}
				required
				labelId="medioTransporte-label"
				value={medioTransporte}
				onChange={e => dispatcher('setMedioTransporte', e.target.value)}
				label="Desplazamiento"
				color="secondary"
				sx={{ width: '35ch' }}
			>
				{MEDIOS_TRANSPORTE.map(transporte => <MenuItem key={transporte.clave} value={transporte.clave}>{transporte.texto}</MenuItem>)}
			</Select>
		</FormControl>

		{medioTransporte !== 'propio' &&
			<Box sx={{ py: 3, display: 'flex', flexDirection: 'column' }}>

				<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} >
					<DatePicker
						//disabled={actualizando}
						label="Fecha del viaje"
						renderInput={(params) => <TextField {...params} sx={{ width: '30ch' }} onKeyDown={(e) => e.preventDefault()} />}
						value={fechaViaje}
						// disablePast
						onChange={(nuevaFecha) => dispatcher('setFechaViaje', nuevaFecha)}
						slotProps={{
							textField: {
								onBeforeInput: (e) => {
									e.preventDefault();
									return false;
								},
							}
						}}
					/>
				</LocalizationProvider>


				<TextField
					//disabled={actualizando}
					color="secondary"
					variant="outlined"
					label="Origen"
					required
					value={origen}
					error={!Boolean(origen.trim())}
					onChange={(e) => dispatcher('setOrigen', e.target.value)}
					sx={{ my: 2, width: { xs: '100%', sm: '50ch' } }}
				/>

				<TextField
					//disabled={actualizando}
					color="secondary"
					variant="outlined"
					label="Destino"
					required
					value={destino}
					error={!Boolean(destino.trim())}
					onChange={(e) => dispatcher('setDestino', e.target.value)}
					sx={{ mb: 2, width: { xs: '100%', sm: '50ch' } }}
				/>

				<Box>

					<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} >
						<TimePicker
							//disabled={actualizando}
							label="Hora de salida"
							renderInput={(params) => <TextField {...params} sx={{ width: '20ch', mr: 1, my: 1 }} onKeyDown={(e) => e.preventDefault()} />}
							value={horaSalida}
							onChange={(nuevaFecha) => dispatcher('setHoraSalida', nuevaFecha)}
						/>
					</LocalizationProvider>

				</Box>
			</Box>
		}
	</Box>
}
