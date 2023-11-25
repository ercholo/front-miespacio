import React from 'react';
import { Grid } from '@mui/material';

import CalendarioSala from './CalendarioSala';
import InfoDiaSeleccionado from './InfoDiaSeleccionado';
import BoxInfoSalaSeleccionada from './BoxInfoSalaSeleccionada';

export default function ReservasSala() {
	const [fecha, setFecha] = React.useState(new Date());




	return <>

		<Grid container spacing={2}>
			<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'left' }} >
				<BoxInfoSalaSeleccionada />
			</Grid>
			<Grid item xs={12} md={6} lg="auto" sx={{ display: 'flex', justifyContent: 'center' }} >
				<CalendarioSala {...{ fecha, setFecha }} />
			</Grid>
			<Grid item xs={12} md={6} lg={8} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
				<InfoDiaSeleccionado fecha={fecha} />
			</Grid>
		</Grid>
	</>

}



