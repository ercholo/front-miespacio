import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../../api/api';


export const preBusquedaNoticias = createAsyncThunk('noticiasGestion/preBusquedaNoticias',
	async (consulta, redux) => {
		try {
			return redux.fulfillWithValue(consulta);
		} finally {
			redux.dispatch(busquedaNoticias(consulta))
		}
	}
);

export const busquedaNoticias = createAsyncThunk('noticiasGestion/busquedaNoticias',
	async ({ texto, from, limit, formato }, redux) => {
		try {
			let respuesta = await API(redux).noticias.get({ texto, from, limit, formato });
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			return redux.rejectWithValue(error);
		}
	}
);


export const listadoReducer = (builder) => {
	builder
		.addCase(preBusquedaNoticias.fulfilled, (state, action) => {
			state.listado.consulta = action.payload;
			state.listado.estado = 'cargando';
			state.listado.error = null;
		});


	builder
		.addCase(busquedaNoticias.pending, (state) => {
			state.listado.resultado = null;
			state.listado.estado = 'cargando';
			state.listado.error = null;
		})
		.addCase(busquedaNoticias.fulfilled, (state, action) => {
			state.listado.resultado = action.payload;
			state.listado.estado = 'completado';
			state.listado.error = null;
		})
		.addCase(busquedaNoticias.rejected, (state, action) => {
			state.listado.resultado = null;
			state.listado.estado = 'error';
			state.listado.error = action.payload;
		});

}