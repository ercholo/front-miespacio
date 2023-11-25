import { createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import SAP from '../../../api/sap';
import { consultarSalas } from './salasSlice.salas';

export const consultarZonas = createAsyncThunk('salas/consultarZonas',
	async (_, redux) => {
		try {
			let respuesta = await SAP(redux).salas.consultarZonas();
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		}
	}
);

export const seleccionarZona = createAsyncThunk('salas/seleccionarZona',
	async ({ codigoZona }, redux) => {
		try {
			return redux.fulfillWithValue(codigoZona)
		} finally {
			redux.dispatch(consultarSalas({ codigoZona }))
		}
	}
);


const selectCodigoZonaSeleccionada = state => state.salas.zonaSeleccionada;
const selectMaestroZonas = state => state.salas.zonas;
export const selectZonaSeleccionada = createSelector([selectCodigoZonaSeleccionada, selectMaestroZonas], (codigoZonaSeleccionada, zonas) => {
	return zonas.resultado?.find(z => z.codigo === codigoZonaSeleccionada) || null;
})

export default function build(builder) {
	builder
		.addCase(consultarZonas.pending, (state) => {
			state.zonas.resultado = null;
			state.zonas.estado = 'cargando';
			state.zonas.error = null;
		})
		.addCase(consultarZonas.fulfilled, (state, action) => {
			state.zonas.resultado = action.payload;
			state.zonas.estado = 'completado';
			state.zonas.error = null;
		})
		.addCase(consultarZonas.rejected, (state, action) => {
			state.zonas.resultado = null;
			state.zonas.estado = 'error';
			state.zonas.error = action.payload;
		});


	builder
		.addCase(seleccionarZona.fulfilled, (state, action) => {
			state.zonaSeleccionada = action.payload;
			state.salaSeleccionada = null;
		})


}