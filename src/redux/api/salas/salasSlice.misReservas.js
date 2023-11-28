import { createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import SAP from '../../../api/sap';
import { differenceInMinutes } from 'date-fns';
import { consultarReservasSala } from './salasSlice.reservas';


export const consultarMisReservas = createAsyncThunk('salas/consultarMisReservas',
	async (_, redux) => {
		try {
			let respuesta = await SAP(redux).salas.consultarMisReservas();
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		}
	}
);

export const marcarParaBorrar = createAsyncThunk('salas/marcarParaBorrar',
	async ({ id }, redux) => {
		try {
			return redux.fulfillWithValue(id);
		} finally {
			redux.dispatch(cancelarReserva({ id }));
		}
	}
);

const cancelarReserva = createAsyncThunk('salas/cancelarReserva',
	async ({ id }, redux) => {
		try {
			let respuesta = await SAP(redux).salas.cancelarReserva(id);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		} finally {
			let codigoZona = redux.getState().salas.zonaSeleccionada;
			let codigoSala = redux.getState().salas.salaSeleccionada;
			redux.dispatch(consultarMisReservas());
			redux.dispatch(consultarReservasSala({ codigoZona, codigoSala }));
		}
	}
);

export const reservarSala = createAsyncThunk('salas/reservarSala',
	async ({ codigoZona, codigoSala, inicio, fin, motivo, comentario }, redux) => {
		try {
			let respuesta = await SAP(redux).salas.reservarSala(codigoZona, codigoSala, inicio, fin, motivo, comentario);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		} finally {
			redux.dispatch(consultarMisReservas());
			redux.dispatch(consultarReservasSala({ codigoZona, codigoSala }));
		}
	}
);



const _selectMisReservasSalas = state => state.salas.misReservas;
export const selectMisReservasSalas = createSelector([_selectMisReservasSalas], (reservas) => {
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
		}).sort((a, b) => a.inicio.getTime() - b.inicio.getTime()) || []
	}
})


export const misReservasReducer = (builder) => 
{
	builder
		.addCase(consultarMisReservas.pending, (state) => {
			state.misReservas.resultado = null;
			state.misReservas.estado = 'cargando';
			state.misReservas.error = null;
		})
		.addCase(consultarMisReservas.fulfilled, (state, action) => {
			state.misReservas.resultado = action.payload;
			state.misReservas.estado = 'completado';
			state.misReservas.error = null;
		})
		.addCase(consultarMisReservas.rejected, (state, action) => {
			state.misReservas.resultado = null;
			state.misReservas.estado = 'error';
			state.misReservas.error = action.payload;
		});


	builder
		.addCase(cancelarReserva.pending, (state) => {
			state.cancelacionReserva.resultado = null;
			state.cancelacionReserva.estado = 'cargando';
			state.cancelacionReserva.error = null;
		})
		.addCase(cancelarReserva.fulfilled, (state, action) => {
			state.cancelacionReserva.resultado = action.payload;
			state.cancelacionReserva.estado = 'completado';
			state.cancelacionReserva.error = null;
		})
		.addCase(cancelarReserva.rejected, (state, action) => {
			state.cancelacionReserva.resultado = null;
			state.cancelacionReserva.estado = 'error';
			state.cancelacionReserva.error = action.payload;
		})

	builder
		.addCase(reservarSala.pending, (state) => {
			state.creacionReservaSala.resultado = null;
			state.creacionReservaSala.estado = 'cargando';
			state.creacionReservaSala.error = null;
		})
		.addCase(reservarSala.fulfilled, (state, action) => {
			state.creacionReservaSala.resultado = action.payload;
			state.creacionReservaSala.estado = 'completado';
			state.creacionReservaSala.error = null;
		})
		.addCase(reservarSala.rejected, (state, action) => {
			state.creacionReservaSala.resultado = null;
			state.creacionReservaSala.estado = 'error';
			state.creacionReservaSala.error = action.payload;
		});

	builder
		.addCase(marcarParaBorrar.fulfilled, (state, action) => {
			state.cancelacionReserva.idReserva = action.payload;
		})

}