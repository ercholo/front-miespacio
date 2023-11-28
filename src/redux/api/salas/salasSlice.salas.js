import { createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import SAP from '../../../api/sap';
import { consultarReservasSala } from './salasSlice.reservas';

export const consultarSalas = createAsyncThunk('salas/consultarSalas',
	async ({ codigoZona }, redux) => {
		try {
			let respuesta = await SAP(redux).salas.consultarSalas(codigoZona);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		}
	}
);

export const seleccionarSala = createAsyncThunk('salas/seleccionarSala',
	async ({ codigoSala }, redux) => {
		try {
			return redux.fulfillWithValue(codigoSala)
		} finally {
			let codigoZona = redux.getState().salas.zonaSeleccionada;
			redux.dispatch(consultarReservasSala({ codigoZona: codigoZona, codigoSala }))
		}
	}
);


const selectCodigoSalaSeleccionada = state => state.salas.salaSeleccionada;
const selectMaestroSalas = state => state.salas.salas;
export const selectSalaSeleccionada = createSelector([selectCodigoSalaSeleccionada, selectMaestroSalas], (codigoSalaSeleccionada, salas) => {
	return salas.resultado?.find(z => z.codigo === codigoSalaSeleccionada) || null;
})

export const salasReducer = (builder) => {
	builder
		.addCase(consultarSalas.pending, (state) => {
			state.salas.resultado = null;
			state.salas.estado = 'cargando';
			state.salas.error = null;
		})
		.addCase(consultarSalas.fulfilled, (state, action) => {
			state.salas.resultado = action.payload;
			state.salas.estado = 'completado';
			state.salas.error = null;
		})
		.addCase(consultarSalas.rejected, (state, action) => {
			state.salas.resultado = null;
			state.salas.estado = 'error';
			state.salas.error = action.payload;
		});

	builder
		.addCase(seleccionarSala.fulfilled, (state, action) => {
			state.salaSeleccionada = action.payload;
		});

}