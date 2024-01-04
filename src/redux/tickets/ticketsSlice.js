import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '../../api/api';
import { createCustomSelector } from '../../redux/createCustomSelector';

const SLICE_NAME = 'tickets'

export const redux_tickets_listar = createAsyncThunk(SLICE_NAME + '/redux_tickets_listar',
	async (_, redux) => {
		try {
			let respuesta = await API(redux).empleados.ticketsSoporte.get();
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			return redux.rejectWithValue(error);
		}
	}
);
redux_tickets_listar.extraReducers = function (builder) {
	const asyncFoo = 'listar';
	builder.addCase(redux_tickets_listar.pending, (state) => {
		state.async[asyncFoo].estado = 'cargando';
		state.async[asyncFoo].error = null;

	});
	builder.addCase(redux_tickets_listar.fulfilled, (state, action) => {
		state.listado = action.payload;

		state.async[asyncFoo].estado = 'completado';
		state.async[asyncFoo].error = null;
	});
	builder.addCase(redux_tickets_listar.rejected, (state, action) => {
		state.async[asyncFoo].estado = 'error';
		state.async[asyncFoo].error = action.payload;
	});
}


export const redux_tickets_crear = createAsyncThunk(SLICE_NAME + '/redux_tickets_crear',
	async (ticket, redux) => {
		try {
			let respuesta = await API(redux).empleados.ticketsSoporte.post(ticket);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			return redux.rejectWithValue(error);
		}
	}
);
redux_tickets_crear.extraReducers = function (builder) {
	const asyncFoo = 'crear';
	builder.addCase(redux_tickets_crear.pending, (state) => {
		state.async[asyncFoo].estado = 'cargando';
		state.async[asyncFoo].error = null;

	});
	builder.addCase(redux_tickets_crear.fulfilled, (state, action) => {
		state.creado = action.payload;

		state.async[asyncFoo].estado = 'completado';
		state.async[asyncFoo].error = null;
	});
	builder.addCase(redux_tickets_crear.rejected, (state, action) => {
		state.async[asyncFoo].estado = 'error';
		state.async[asyncFoo].error = action.payload;
	});
}



export const ticketsSlice = createSlice({
	name: SLICE_NAME,

	initialState: {
		async: {
			listar: { estado: 'inicial', error: null },
			crear: { estado: 'inicial', error: null },
		},
		listado: [],
		creado: null
	},
	reducers: {
		// eslint-disable-next-line no-unused-vars
		redux_tickets_ResetearEstadoCrear: (state, _) => {
			state.async.crear = { estado: 'inicial', error: null };
			state.creado = null;
		}
	},
	extraReducers: (builder) => {
		redux_tickets_listar.extraReducers(builder);
		redux_tickets_crear.extraReducers(builder);
	}
});


const s1 = (state) => state.tickets.async.listar;
export const redux_tickets_select_EstadoListado = createCustomSelector(s1, (estadoCarga) => {
	return {
		estado: estadoCarga.estado,
		error: estadoCarga.error
	}
})

const s2 = (state) => state.tickets.listado;
export const redux_tickets_select_Listado = createCustomSelector(s2, (listado) => {

	if (Array.isArray(listado)) {
		return listado.map(ticket => {

			return  {
				id: ticket.id,
				asunto: ticket.asunto,
				email: ticket.email,
				enlace: ticket.enlace,
				estado: ticket.estado,
				fechaCreacion: new Date(ticket.fechaCreacion),
				fechaModificacion: new Date(ticket.fechaModificacion),

			}
		})
	}
	return [];
})



const s3 = [
	(state) => state.tickets.async.crear,
	(state) => state.tickets.creado
]
export const redux_tickets_select_EstadoCrear = createCustomSelector(s3, (estadoCreacion, creado) => {
	return {
		estado: estadoCreacion.estado,
		error: estadoCreacion.error,
		numeroTicket: creado?.id || null
	}
})

export const { redux_tickets_ResetearEstadoCrear } = ticketsSlice.actions;