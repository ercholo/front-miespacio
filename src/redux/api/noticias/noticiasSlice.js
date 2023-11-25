import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../api/api';


export const redux_noticias_estableceFiltroFeed = createAsyncThunk('noticias/estableceFiltroFeed',
	async ({ texto }, redux) => {
		try {
			return redux.fulfillWithValue(texto);
		} finally {
			redux.dispatch(redux_noticias_feedNext({ texto }))
		}
	}
);

export const redux_noticias_feedNext = createAsyncThunk('noticias/feedNext',
	async (_, redux) => {
		try {
			// PILLAR EL FROM DE LOS ULTIMOS RESULTADOS
			let feed = redux.getState().noticias.feed;
			let noticia = feed?.length > 0 && feed[feed.length - 1];
			let ultimaFecha = noticia && (noticia.fechaPublicacion || noticia.fechaCreacion);

			let respuesta = await API(redux).empleados.noticias.get({from: ultimaFecha, limit: 10, formato: 'minimo'});
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			console.log('noticias/feedNext: API ERROR: ', error);
			return redux.rejectWithValue(error);
		}
	}
);


export const redux_noticias_consultaId = createAsyncThunk('noticias/consultaId',
	async ({ idNoticia, formato }, redux) => {
		try {
			let respuesta = await API(redux).noticias.idNoticia.get(idNoticia, formato);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			console.log('noticias/consultaId: API ERROR: ', error);
			return redux.rejectWithValue(error);
		}
	}
);


export const noticiasSlice = createSlice({
	name: 'noticias',
	initialState:
	{
		feed: [],
		filtro: {
			texto: null
		},
		estadoConsultaFeed: {
			estado: 'cargando',
			error: null
		},
		porId: {
			resultado: null,
			estado: 'cargando',
			error: null
		},

	},
	extraReducers: (builder) => {
		builder
			.addCase(redux_noticias_estableceFiltroFeed.fulfilled, (state, action) => {
				state.consulta = action.payload;
			});

		builder
			.addCase(redux_noticias_feedNext.pending, (state) => {
				state.estadoConsultaFeed.estado = 'cargando';
				state.estadoConsultaFeed.error = null;
			})
			.addCase(redux_noticias_feedNext.fulfilled, (state, action) => {
				state.estadoConsultaFeed.estado = 'completado';
				state.estadoConsultaFeed.error = null;
				state.feed = [...state.feed, ...action.payload]
			})
			.addCase(redux_noticias_feedNext.rejected, (state, action) => {
				state.estadoConsultaFeed.estado = 'error';
				state.estadoConsultaFeed.error = action.payload;
			});

		builder
			.addCase(redux_noticias_consultaId.pending, (state) => {
				state.porId.estado = 'cargando';
				state.porId.error = null;
				state.porId.resultado = null;
			})
			.addCase(redux_noticias_consultaId.fulfilled, (state, action) => {
				state.porId.estado = 'completado';
				state.porId.error = null;
				state.porId.resultado = action.payload;
			})
			.addCase(redux_noticias_consultaId.rejected, (state, action) => {
				state.porId.estado = 'error';
				state.porId.error = action.payload;
				state.porId.resultado = null;
			});
	},
});

export default noticiasSlice.reducer;
