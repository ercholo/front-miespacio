import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SAP from '../../api/sap';


export const consultarVales = createAsyncThunk('vales/consultarVales',
	async ({ mes, ano, modoBusqueda }, redux) => {

		try {
			let respuesta = await SAP(redux).consultaVales(mes, ano, modoBusqueda);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		}
	}
);

export const valesSlice = createSlice({
	name: 'vales',
	initialState: {
		estado: 'inicial',
		resultado: null,
		error: null
	},
	reducers: {
		limpiarEstadoConsulta: (state) => {
			state.estado = 'inicial';
			state.resultado = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(consultarVales.pending, (state) => {
				state.resultado = null;
				state.estado = 'cargando';
				state.error = null;
			})
			.addCase(consultarVales.fulfilled, (state, action) => {
				state.resultado = action.payload;
				state.estado = 'completado';
				state.error = null;
			})
			.addCase(consultarVales.rejected, (state, action) => {
				state.resultado = null;
				state.estado = 'error';
				state.error = action.payload;
			});
	},
});

export const { limpiarEstadoConsulta } = valesSlice.actions;
