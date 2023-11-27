import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../api/api';
import { createCustomSelector } from '../createCustomSelector';

export const redux_gestionViajes_solicitar = createAsyncThunk('gestion/viajes/redux_gestionViajes_solicitar',
	async (solicitudViaje, redux) => {
		try {
			await API(redux).empleados.solicitudesViaje.post(solicitudViaje)
			return redux.fulfillWithValue({});
		} catch (error) {
			return redux.rejectWithValue(error);
		}
	}
);
redux_gestionViajes_solicitar.extraReducers = function (builder) {
	const asyncFoo = 'solicitar';
	builder.addCase(redux_gestionViajes_solicitar.pending, (state) => {
		state.async[asyncFoo].estado = 'cargando';
		state.async[asyncFoo].error = null;
	});
	builder.addCase(redux_gestionViajes_solicitar.fulfilled, (state) => {
		state.async[asyncFoo].estado = 'completado';
		state.async[asyncFoo].error = null;
	});
	builder.addCase(redux_gestionViajes_solicitar.rejected, (state, action) => {
		state.async[asyncFoo].estado = 'error';
		state.async[asyncFoo].error = action.payload;
	});
}

export const gestionViajesSlice = createSlice({
	name: 'gestion/viajes',

	initialState: {
		async: {
			solicitar: { estado: 'inicial', error: null },
		},
	},
	reducers: {
		redux_gestionViajes_limpiarSolicitud: (state) => {
			state.async.solicitar = { estado: 'inicial', error: null };
		}
	},
	extraReducers: (builder) => {
		redux_gestionViajes_solicitar.extraReducers(builder);
	}
});



const s1 = (state) => state.gestion.viajes.async.solicitar;
export const redux_gestionViajes_select_EstadoSolicitud = createCustomSelector(s1, (estadoSolicitud) => {
	return {
		estado: estadoSolicitud.estado,
		error: estadoSolicitud.error
	}
})

export const { redux_gestionViajes_limpiarSolicitud } = gestionViajesSlice.actions;