import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../api/api';


export const consultaMaestroAsignaciones = createAsyncThunk('maestroAsignaciones/consulta',
	async (_, redux) => {
		try {
			let respuesta = await API(redux).asignaciones.get();
			console.log(respuesta)
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			return redux.rejectWithValue(error);
		}
	}
);

export const maestroAsignacionesSlice = createSlice({
	name: 'maestroAsignaciones',
	initialState:
	{
		estado: 'inicial',
		resultado: null,
		error: null
	},
	extraReducers: (builder) => {
		console.log(builder)
		builder
			.addCase(consultaMaestroAsignaciones.pending, (state) => {
				state.resultado = null;
				state.estado = 'cargando';
				state.error = null;
			})
			.addCase(consultaMaestroAsignaciones.fulfilled, (state, action) => {
				state.resultado = action.payload;
				state.estado = 'completado';
				state.error = null;
			})
			.addCase(consultaMaestroAsignaciones.rejected, (state, action) => {
				state.resultado = null;
				state.estado = 'error';
				state.error = action.payload;
			});
	},
});