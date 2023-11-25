import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SAP from '../../api/sap';


export const consultarAccesos = createAsyncThunk('accesos/consultarAccesos',
	async ({ fecha }, redux) => {

		try {
			let respuesta = await SAP(redux).consultaAccesos(fecha);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		}
	}
);



export const accesosSlice = createSlice({
	name: 'accesos',
	initialState: {
		estado: 'inicial',
		resultado: null,
		error: null
	},
	reducers: {
		limpiarEstadoConsulta: (state, _) => {
			state.estado = 'inicial';
			state.resultado = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(consultarAccesos.pending, (state) => {
				state.resultado = null;
				state.estado = 'cargando';
				state.error = null;
			})
			.addCase(consultarAccesos.fulfilled, (state, action) => {
				state.resultado = action.payload;
				state.estado = 'completado';
				state.error = null;
			})
			.addCase(consultarAccesos.rejected, (state, action) => {
				state.resultado = null;
				state.estado = 'error';
				state.error = action.payload;
			});
	},
});



export const { limpiarEstadoConsulta } = accesosSlice.actions;
export default accesosSlice.reducer;
