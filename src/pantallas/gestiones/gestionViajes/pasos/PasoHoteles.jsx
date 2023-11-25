import { TextField, Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"
import { OPCIONES_HOTELES } from "./Pasos";




export const PasoHoteles = ({ dispatcher, medioTransporte, numeroHoteles, datosHoteles }) => {
	return <Box>
		<Typography variant="h6" sx={{ mb: 2 }}>Reserva de Hoteles</Typography>
		<FormControl variant="outlined" sx={{ mr: 2, my: 2 }}>
			<InputLabel id="numeroHoteles-label" color="secondary">Cantidad de hoteles para reservar:</InputLabel>
			<Select
				//disabled={actualizando}
				required
				labelId="numeroHoteles-label"
				value={numeroHoteles}
				onChange={e => dispatcher('setNumeroHoteles', e.target.value)}
				label="Cantidad de hoteles para reservar:"
				color="secondary"
				sx={{ width: '35ch' }}
			>
				{OPCIONES_HOTELES.map(opcionHotel => <MenuItem key={opcionHotel.clave} value={opcionHotel.clave}>{opcionHotel.texto}</MenuItem>)}
			</Select>
		</FormControl>

		{
			datosHoteles.filter((_, i) => i < numeroHoteles).map((hotel, i) => <Paper key={i} sx={{ px: 4, py: 3, mb: 2, display: 'flex', flexDirection: 'column' }}>
				<Typography variant="h6" sx={{ mb: 2 }}>Hotel #{i + 1}</Typography>
				<Box>
					<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} >
						<DatePicker
							//disabled={actualizando}
							label="Fecha de entrada"
							renderInput={(params) => <TextField {...params} sx={{ width: '30ch' }} onKeyDown={(e) => e.preventDefault()} />}
							// disablePast
							value={hotel.fechaEntrada}
							onChange={(nuevaFecha) => { dispatcher('setFechaEntradaHotel', { index: i, payload: nuevaFecha }) }}

						/>
					</LocalizationProvider>
					<TextField
						//disabled={actualizando}
						color="secondary"
						variant="outlined"
						label="Número de noches"
						type="number"
						value={hotel.numeroNoches}
						onChange={(e) => { dispatcher('setNumeroNochesHotel', { index: i, payload: e.target.value }) }}
						sx={{ width: '20ch', ml: {xs: 0, sm: 1}, mt: { xs: 2, sm: 0} }}
						//inputProps={{ inputMode: 'numeric', pattern: '[1-9]' }}
						InputLabelProps={{ shrink: true }}
					/>
				</Box>


				<TextField
					//disabled={actualizando}
					color="secondary"
					variant="outlined"
					label="Nombre del hotel"
					required
					value={hotel.nombre}
					error={!Boolean(hotel.nombre.trim())}
					onChange={(e) => { dispatcher('setNombreHotel', { index: i, payload: e.target.value }) }}
					sx={{ my: 2, width: '100%' }}
				/>

			</Paper>
			)}

	</Box>
}
