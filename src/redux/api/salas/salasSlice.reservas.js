import { createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import SAP from '../../../api/sap';
import { differenceInMinutes } from 'date-fns';

export const consultarReservasSala = createAsyncThunk('salas/consultarReservasSala',
	async ({ codigoZona, codigoSala }, redux) => {
		try {
			let respuesta = await SAP(redux).salas.consultarReservasSala(codigoZona, codigoSala);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		}
	}
);


const selectMaestroReservas = state => state.salas.reservas;
export const selectReservas = createSelector([selectMaestroReservas], (reservas) => {
	return {
		estado: reservas.estado,
		error: reservas.error,
		resultado: reservas?.resultado?.map(r => {
			let inicio = new Date(r.inicio);
			let fin = new Date(r.fin);
			return {
				...r,
				inicio,
				fin,
				diaCompleto: differenceInMinutes(fin, inicio) >= 1439
			}
		}).sort((a,b) => a.inicio.getTime() - b.inicio.getTime()) || []
	}
})

export const reservasReducer = (builder) => {
	builder
		.addCase(consultarReservasSala.pending, (state) => {
			state.reservas.resultado = null;
			state.reservas.estado = 'cargando';
			state.reservas.error = null;
		})
		.addCase(consultarReservasSala.fulfilled, (state, action) => {
			state.reservas.resultado = action.payload;
			state.reservas.estado = 'completado';
			state.reservas.error = null;
		})
		.addCase(consultarReservasSala.rejected, (state, action) => {
			state.reservas.resultado = null;
			state.reservas.estado = 'error';
			state.reservas.error = action.payload;
		})


}