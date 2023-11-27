import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../../api/api';


export const preConsultaNoticiaEdicion = createAsyncThunk('noticiasGestion/preConsultaId',
	async ({ idNoticia, formato }, redux) => {
		try {
			return redux.fulfillWithValue(idNoticia);
		} finally {
			redux.dispatch(consultaNoticiaEdicion({ idNoticia, formato }))
		}
	}
);

export const consultaNoticiaEdicion = createAsyncThunk('noticiasGestion/consultaId',
	async ({ idNoticia, formato }, redux) => {
		try {
			let respuesta = await API(redux).noticias.idNoticia.get(idNoticia, formato);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			return redux.rejectWithValue(error);
		}
	}
);

export const actualizaNoticiaEdicion = createAsyncThunk('noticiasGestion/actualizaId',
	async ({ idNoticia, payload }, redux) => {
		try {
			let respuesta = await API(redux).noticias.idNoticia.put(idNoticia, payload);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			return redux.rejectWithValue(error);
		}
	}
);


export const crearNoticiaEdicion = createAsyncThunk('noticiasGestion/crear',
	// eslint-disable-next-line no-unused-vars
	async ({ idNoticia, payload }, redux) => {
		try {
			let respuesta = await API(redux).noticias.post(payload);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			return redux.rejectWithValue(error);
		}
	}
);


export const preBorrarNoticiaEdicion = createAsyncThunk('noticiasGestion/preBorrarId',
	async ({ idNoticia }, redux) => {
		try {
			return redux.fulfillWithValue(idNoticia);
		} finally {
			redux.dispatch(borrarNoticiaEdicion({ idNoticia }))
		}
	}
);

export const borrarNoticiaEdicion = createAsyncThunk('noticiasGestion/borrarId',
	async ({ idNoticia }, redux) => {
		try {
			let respuesta = await API(redux).noticias.idNoticia.del(idNoticia);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			return redux.rejectWithValue(error);
		}
	}
);

export const edicionReducer = (builder) => {
	builder
		.addCase(preConsultaNoticiaEdicion.fulfilled, (state, action) => {
			state.editor.idNoticia = action.payload;
			state.editor.consulta.resultado = null;
			state.editor.consulta.estado = 'cargando';
			state.editor.consulta.error = null;
		});


	builder
		.addCase(consultaNoticiaEdicion.pending, (state) => {
			state.editor.consulta.resultado = null;
			state.editor.consulta.estado = 'cargando';
			state.editor.consulta.error = null;
		})
		.addCase(consultaNoticiaEdicion.fulfilled, (state, action) => {
			state.editor.consulta.resultado = action.payload;
			state.editor.consulta.estado = 'completado';
			state.editor.consulta.error = null;
		})
		.addCase(consultaNoticiaEdicion.rejected, (state, action) => {
			state.editor.consulta.resultado = null;
			state.editor.consulta.estado = 'error';
			state.editor.consulta.error = action.payload;
		});



	builder
		.addCase(actualizaNoticiaEdicion.pending, (state) => {
			state.editor.edicion.resultado = null;
			state.editor.edicion.estado = 'cargando';
			state.editor.edicion.error = null;
		})
		.addCase(actualizaNoticiaEdicion.fulfilled, (state, action) => {
			state.editor.edicion.resultado = action.payload;
			state.editor.edicion.estado = 'completado';
			state.editor.edicion.error = null;
		})
		.addCase(actualizaNoticiaEdicion.rejected, (state, action) => {
			state.editor.edicion.resultado = null;
			state.editor.edicion.estado = 'error';
			state.editor.edicion.error = action.payload;
		});


	builder
		.addCase(crearNoticiaEdicion.pending, (state) => {
			state.crear.resultado = null;
			state.crear.estado = 'cargando';
			state.crear.error = null;
		})
		.addCase(crearNoticiaEdicion.fulfilled, (state, action) => {
			state.crear.resultado = action.payload;
			state.crear.estado = 'completado';
			state.crear.error = null;
		})
		.addCase(crearNoticiaEdicion.rejected, (state, action) => {
			state.crear.resultado = null;
			state.crear.estado = 'error';
			state.crear.error = action.payload;
		});


	builder
		.addCase(preBorrarNoticiaEdicion.fulfilled, (state, action) => {
			state.borrar.idNoticia = action.payload;
			state.borrar.resultado = null;
			state.borrar.estado = 'cargando';
			state.borrar.error = null;
		});

	builder
		.addCase(borrarNoticiaEdicion.pending, (state) => {
			state.borrar.resultado = null;
			state.borrar.estado = 'cargando';
			state.borrar.error = null;
		})
		.addCase(borrarNoticiaEdicion.fulfilled, (state, action) => {
			state.borrar.resultado = action.payload;
			state.borrar.estado = 'completado';
			state.borrar.error = null;
		})
		.addCase(borrarNoticiaEdicion.rejected, (state, action) => {
			state.borrar.resultado = null;
			state.borrar.estado = 'error';
			state.borrar.error = action.payload;
		});
}