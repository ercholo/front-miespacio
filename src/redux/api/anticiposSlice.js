import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SAP from '../../api/sap';


export const consultarAnticipos = createAsyncThunk('anticipos/consultarAnticipos',
	async (_, redux) => {

		try {
			let respuesta = await SAP(redux).consultarAnticipos();
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		}
	}
);


export const consultarHistoricoAnticipos = createAsyncThunk('anticipos/consultarHistoricoAnticipos',
	async (_, redux) => {

		try {
			let respuesta = await SAP(redux).consultarHistoricoAnticipos();
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		}
	}
);


export const solicitarAnticipo = createAsyncThunk('anticipos/solicitarAnticipo',
	async ({ anticipos, prestamos, metodoIngreso }, redux) => {
		try {
			let respuesta = await SAP(redux).solicitarAnticipo(anticipos, prestamos, metodoIngreso);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		}
	}
);


export const anticiposSlice = createSlice({
	name: 'anticipos',
	initialState: {
		estado: 'inicial',
		resultado: null,
		error: null,
		historico: {
			estado: 'inicial',
			resultado: null,
			error: null
		},
		solicitudAnticipo: {
			estado: 'inicial',
			resultado: null,
			error: null
		}
	},
	reducers: {
		limpiarEstadoCreacionAnticipo: (state) => {
			state.solicitudAnticipo.resultado = null;
			state.solicitudAnticipo.estado = 'inicial';
			state.solicitudAnticipo.error = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(consultarAnticipos.pending, (state) => {
				state.resultado = null;
				state.estado = 'cargando';
				state.error = null;
			})
			.addCase(consultarAnticipos.fulfilled, (state, action) => {
				state.resultado = action.payload;
				state.estado = 'completado';
				state.error = null;
			})
			.addCase(consultarAnticipos.rejected, (state, action) => {
				state.resultado = null;
				state.estado = 'error';
				state.error = action.payload;
			})
			.addCase(consultarHistoricoAnticipos.pending, (state) => {
				state.historico.resultado = null;
				state.historico.estado = 'cargando';
				state.historico.error = null;
			})
			.addCase(consultarHistoricoAnticipos.fulfilled, (state, action) => {
				state.historico.resultado = action.payload;
				state.historico.estado = 'completado';
				state.historico.error = null;
			})
			.addCase(consultarHistoricoAnticipos.rejected, (state, action) => {
				state.historico.resultado = null;
				state.historico.estado = 'error';
				state.historico.error = action.payload;
			})
			.addCase(solicitarAnticipo.pending, (state) => {
				state.solicitudAnticipo.resultado = null;
				state.solicitudAnticipo.estado = 'cargando';
				state.solicitudAnticipo.error = null;
			})
			.addCase(solicitarAnticipo.fulfilled, (state, action) => {
				state.solicitudAnticipo.resultado = action.payload;
				state.solicitudAnticipo.estado = 'completado';
				state.solicitudAnticipo.error = null;
			})
			.addCase(solicitarAnticipo.rejected, (state, action) => {
				state.solicitudAnticipo.resultado = null;
				state.solicitudAnticipo.estado = 'error';
				state.solicitudAnticipo.error = action.payload;
			});
	},
});



export const { limpiarEstadoCreacionAnticipo } = anticiposSlice.actions;
